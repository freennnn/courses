export enum NavigationState {
  Featured = 'Featured',
  TopCategories = 'Top Categories',
  Sale = 'Sale',
  SignIn = 'Sign In',
  SignUp = 'Sign Up',
  UserProfile = 'Hey, ',
  LogOut = 'Log out',
  //AuthorizationState = 'Auth',
  Basket = 'Basket',
}

// export enum AuthorizationState {
//   SignIn = 'Sign In',
//   SignUp = 'Sign Up',
//   UserProfile = 'Hey, ',
// }

interface User {
  name: string;
  [key: string]: string | number | object;
}

export interface NavigationPropsType {
  activeState?: NavigationState;
  states?: NavigationState[];
  user?: User;
}
