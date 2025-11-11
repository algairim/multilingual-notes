# LLM Query

Generate a complete `backend/nest-cli.json` file.

# LLM Response

Here is the complete `backend/nest-cli.json` file.

This is the standard configuration file for a NestJS project. It tells the Nest CLI that your source code is in the `src` directory and that it should delete the `dist` folder before each build.

Save this as `nest-cli.json` in your `backend/` directory.

### `backend/nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```
