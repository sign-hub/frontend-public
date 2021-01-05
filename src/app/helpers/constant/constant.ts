export class Constant {

  /*  static key = 'f919ee5b-397b-4490-a9f4-c755428b62eb';
   static baseUrl = 'https://repository.ortolang.fr/api/';
   static alias = 'sign-hub-wp-24';
   static root = '1';
   static path = 'path'; */

  /* public static Url = '/api/rest/';
  public static SignhubUrl = '/signhub/';
  public static baseUrl = 'https://repository.ortolang.fr/api/';
  public static baseUrlDemo = 'https://demo-repo.ortolang.fr/api/';

  public static aliasDemo = 'fsessawp';
  public static alias = 'sign-hub';
  public static content = 'content/';

  public static workspacesAlias = 'workspaces/alias/';
  public static workspaces = 'workspaces/';
  static isOrtolangDemo = true; */


  // public static Url = 'http://10.6.0.162:9000/';
  public static Url = '/api/rest/';
  public static SignhubUrl = '/signhub/';
  public static baseUrl = 'https://repository.ortolang.fr/api/';
  public static baseUrlDemo = 'https://repository.ortolang.fr/api/';

  public static aliasDemo = 'fsessawp';
  public static alias = 'sign-hub';
  public static content = 'content/';
  public static language = ['DGS', 'ISL', 'LIS', 'LSC', 'LSE', 'LSF', 'NGT', 'TID'];

  public static root = 4;

  public static workspacesAlias = 'workspaces/f919ee5b-397b-4490-a9f4-c755428b62eb';
  public static workspaces = 'workspaces/';
  static isOrtolangDemo = true;

  static getAlias(): string {
    if (this.isOrtolangDemo) {
      return this.aliasDemo;
    } else {
      return this.alias;
    }
  }

}
