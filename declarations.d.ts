declare module '*.scss';
declare module 'src/questlist/questlist.json' {
  declare var questlist: import('./src/questlist/IQuest').IQuest;

  export default questlist;
}
