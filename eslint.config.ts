import config from "@sripberger/eslint-config";


export default [
	...config,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["eslint.config.ts"],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		// Do not lint template files as they will largely not be valid TS.
		ignores: ["src/templates"],
	},
];
