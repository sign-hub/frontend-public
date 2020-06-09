export class Constant {
  static getAlias(): string {
    if(this.isOrtolangDemo)
      return this.aliasDemo;
    else  
      return this.alias;
  }
  
  //public static Url = 'http://10.6.0.162:9000/';
  public static Url = '/api/rest/';
  public static SignhubUrl = '/signhub/';
  public static baseUrl = 'https://repository.ortolang.fr/api/';
  public static baseUrlDemo = 'https://demo-repo.ortolang.fr/api/';

  public static aliasDemo = 'fsessawp';
  public static alias = 'sign-hub';
  public static content = 'content/'

  public static workspaces_alias = 'workspaces/alias/';
  public static workspaces = 'workspaces/';
  static isOrtolangDemo = true;

}
