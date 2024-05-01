import accessEnum from "@/access/accessEnum";

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser
 * @param needUser
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needUser = accessEnum.NOT_LOGIN) => {
  // 获取当前登录用户具有的权限（如果没有 loginUser,则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? accessEnum.NOT_LOGIN;
  if (needUser === accessEnum.NOT_LOGIN) {
    return true;
  }

  // 如果用户需要登录才能访问
  if (needUser === accessEnum.USER) {
    // 如果用户没登录，表示无权限
    if (loginUserAccess === accessEnum.NOT_LOGIN) {
      return false;
    }
  }

  // 如果需要管理员权限
  if (needUser === accessEnum.ADMIN) {
    // 如果不为管理员，表示无权限
    if (loginUserAccess !== accessEnum.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
