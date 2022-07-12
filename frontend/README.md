## Frontend para api do teste de clientes

## Iniciando o ambiente

```bash
npm install
```

```bash
npm start
```

Url gerado: `http://localhost:3006`

## Deploy em produção

Para realizar o deploy em produção é necessário ter instalado o aws-cli com
um perfil ou credenciais configuradas.

### Requisitos:
- Bucket com static website e acl ativados.
- Aws Cli com credencials do IAM configuradas

### Gerar deploy

```bash
npm run build
```

```bash
npm run deploy
```

Se houver necessidade de alterar o nome do bucket, script de deploy em package.json

## Sobre o projeto frontend.

Desenvolvimento com reactjs na metodologia hooks com a utilização do framework
Antd.

## Tests
Pequena demonstração de testes de unidade utilizando as libraries do react

## Praticas
- Pratica de editable na tabela do antd.
- Test
- Less
- Craco