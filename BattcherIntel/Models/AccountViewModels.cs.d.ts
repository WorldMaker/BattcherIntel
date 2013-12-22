declare module server {

	interface ExternalLoginViewModel{
		name: String;
		url: String;
		state: String;
}
	interface ManageInfoViewModel{
		localLoginProvider: String;
		userName: String;
		logins: UserLoginInfoViewModel[];
		externalLoginProviders: ExternalLoginViewModel[];
}
	interface UserInfoViewModel{
		userName: String;
		hasRegistered: Boolean;
		loginProvider: String;
		roles: string[];
}
	interface UserLoginInfoViewModel{
		loginProvider: String;
		providerKey: String;
}
}
