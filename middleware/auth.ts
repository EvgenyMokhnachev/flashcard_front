import authService from "~/services/AuthService";
import BaseApiRepository from "~/repositories/BaseApiRepository";

export default function (context: any) {
  const onAuthPage = context.route.path.indexOf('auth') > -1;
  const isAuth = authService.isAuthenticated;

  if (!isAuth && !onAuthPage) {
    context.redirect('/auth');
  }

  if (isAuth && onAuthPage) {
    context.redirect('/');
  }

  authService.onAuthError(() => {
    context.redirect('/auth');
  });
}
