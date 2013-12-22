declare module server {

	interface ExternalLoginViewModel{
		Name: String;
		Url: String;
		State: String;
}
	interface ManageInfoViewModel{
		LocalLoginProvider: String;
		UserName: String;
		Logins: UserLoginInfoViewModel[];
		ExternalLoginProviders: ExternalLoginViewModel[];
}
	interface UserInfoViewModel{
		UserName: String;
		HasRegistered: Boolean;
		LoginProvider: String;
		Roles: string[];
}
	interface UserLoginInfoViewModel{
		LoginProvider: String;
		ProviderKey: String;
}
}
