# Creates a stub package.json which will cause files in dist/cjs to be loaded in CommonJS mode.
cat >dist/cjs/package.json <<!EOF
{
	"type": "commonjs"
}
!EOF
