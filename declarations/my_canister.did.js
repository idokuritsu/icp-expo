export const idlFactory = ({ IDL }) => {
  const UserProfile = IDL.Record({ age: IDL.Nat, name: IDL.Text });
  return IDL.Service({
    getMyPrincipal: IDL.Func([], [IDL.Text], []),
    getPrincipal: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    getProfile: IDL.Func([], [IDL.Opt(UserProfile)], []),
    getTotalUsers: IDL.Func([], [IDL.Nat], ["query"]),
    isProfileRegistered: IDL.Func([], [IDL.Bool], []),
    registerProfile: IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    updateProfile: IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
