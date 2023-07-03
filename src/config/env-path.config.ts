const environmentName = {
	production: 'prod',
	development: 'dev',
	local: 'local',
};
export const envFilePath = `.env.${
	environmentName[process.env.NODE_ENV] ?? 'dev'
}`;
