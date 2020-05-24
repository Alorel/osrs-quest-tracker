import {join, relative} from 'path';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import nodeResolve from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import {sassPlugin} from "@alorel/rollup-plugin-scss";
import {modularCssExporterPlugin, modularCssProcessorPlugin} from '@alorel/rollup-plugin-modular-css';
import {
  IifeIndexRendererRuntime as IndexRendererRuntime
} from '@alorel/rollup-plugin-index-renderer-iife';
import typescript from 'rollup-plugin-typescript2';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import JSON5 from 'json5';

const publicPath = '/';
const srcDir = join(__dirname, 'src');
const lambdaDir = join(__dirname, 'lambda');
const distLambda = join(__dirname, 'dist-lambda');
const distDir = join(__dirname, 'dist');
const isProd = process.env.NODE_ENV === 'production';

const indexRenderer = new IndexRendererRuntime({
  base: publicPath,
  input: join(srcDir, 'index.pug'),
  outputFileName: 'index.html',
  pugOptions: {
    self: true
  }
});

const regAllStyles = /\.s?css$/;
const resolveExt = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.json5', '.node'];

export default [
  {
    input: [
      join(lambdaDir, 'get-toon.ts')
    ],
    external: [
      'zlib',
      'https'
    ],
    output: {
      dir: distLambda,
      format: 'cjs',
      entryFileNames: '[name].js',
      sourcemap: false
    },
    plugins: [
      nodeResolve({
        extensions: resolveExt,
        mainFields: ['main']
      }),
      cleanPlugin(),
      typescript({
        tsconfig: 'tsconfig.functions.json'
      })
    ]
  },
  {
    input: join(srcDir, 'index.tsx'),
    output: {
      assetFileNames: `[name]${isProd ? '.[hash]' : ''}.[ext]`,
      dir: distDir,
      format: 'iife',
      entryFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
      chunkFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
      sourcemap: !isProd
    },
    // manualChunks(id) {
    //   if (id.includes('node_modules')) {
    //     return 'vendor';
    //   }
    // },
    plugins: [
      alias({
        entries: [
          {find: /^preact\/(compat|hooks|debug)$/, replacement: 'preact/$1/dist/$1.module.js'},
          {find: /^rxjs\/(operators|ajax)$/, replacement: 'rxjs/_esm5/$1'}
        ]
      }),
      nodeResolve({
        extensions: resolveExt,
        mainFields: ['fesm5', 'esm5', 'module', 'main', 'browser']
      }),
      cleanPlugin(),
      sassPlugin({
        baseUrl: publicPath,
        include: /\.scss$/,
        sassOpts: {
          sourceMap: false
        }
      }),
      modularCssProcessorPlugin({
        include: regAllStyles,
        sourceMap: false,
        ...(() => {
          let fileCounter = 0;
          const fileIds = {};
          const selectorIds = {};

          return {
            processorConfig: {
              before: [
                require('autoprefixer')(),
                require('cssnano')()
              ],
              namer(absoluteFile, selector) {
                const file = relative(__dirname, absoluteFile);
                if (!(file in selectorIds)) {
                  selectorIds[file] = {
                    counter: 0,
                    ids: {}
                  };
                  fileIds[file] = fileCounter.toString(36);
                  fileCounter++;
                }

                const selectors = selectorIds[file];
                if (!selectors.ids[selector]) {
                  selectors.ids[selector] = selectors.counter.toString(36);
                  selectors.counter++;
                }

                const fileId = `f${fileIds[file]}`;
                const selectorId = `s${selectors.ids[selector]}`;

                return fileId + selectorId;
              }
            }
          }
        })()
      }),
      modularCssExporterPlugin({
        pureLoadStyle: false,
        styleImportName: 'loadStyle',
        include: regAllStyles,
        sourceMap: false
      }),
      typescript(),
      replacePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      {
        name: 'simple-json-loader',
        transform(code, id) {
          if (!id.endsWith('.json')) {
            return;
          }

          return {
            code: `export default ${JSON5.stringify(JSON5.parse(code))};`,
            map: {
              mappings: ''
            }
          };
        }
      },
      copyPlugin({
        defaultOpts: {
          glob: {
            cwd: srcDir
          },
          emitNameKind: 'fileName'
        },
        copy: [
          'favicon.png'
        ]
      }),
      indexRenderer.createPlugin(),
      indexRenderer.createOutputPlugin(),
      ...(() => {
        if (!isProd) {
          return [];
        }

        const systemAsset = /^system\.[a-z0-9]+\.js$/;
        const ecma = 5;
        const ie8 = false;
        const safari10 = true;
        const includeSystemAsset = a => systemAsset.test(a.fileName);

        return [
          require('@alorel/rollup-plugin-iife-wrap').iifeWrapPlugin({
            includeAssets: includeSystemAsset,
            ssrAwareVars: []
          }),
          require('@alorel/rollup-plugin-threaded-terser').threadedTerserPlugin({
            terserOpts: {
              compress: {
                drop_console: true,
                keep_infinity: true,
                typeofs: false,
                ecma
              },
              ecma,
              ie8,
              mangle: {
                safari10
              },
              output: {
                comments: false,
                ie8,
                safari10
              },
              safari10,
              sourceMap: false
            },
            includeAssets: includeSystemAsset
          })
        ]
      })(),
    ]
  }
];
