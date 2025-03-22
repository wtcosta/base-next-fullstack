# Projeto Admin WT

## Resumo

Este projeto pretende ser um painel administrativo (admin) desenvolvido em React/Next.js, com uma estrutura organizada seguindo boas práticas de desenvolvimento front-end. A estrutura de pastas foi pensada para uma aplicação moderna com separação clara de responsabilidades.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- **actions/**: Contém as ações da aplicação, provavelmente usando React Server Actions ou Redux actions.
- **services/**: Implementações de serviços para comunicação com APIs e outras integrações externas.
- **app/**: Diretório principal da aplicação, seguindo o padrão App Router do Next.js.
- **_types/**: Definições de tipos TypeScript para a aplicação.
- **lib/**: Bibliotecas e utilitários compartilhados.
- **hooks/**: Custom React Hooks para lógica reutilizável.
- **components/**: Componentes React reutilizáveis.
- **routes/**: Definições de rotas da aplicação.
- **enums/**: Enumerações TypeScript para valores constantes.
- **utils/**: Funções utilitárias gerais.
- **context/**: Contextos React para gerenciamento de estado global.
- **icons/**: Componentes de ícones ou assets.
- **layout/**: Componentes de layout, como headers, footers e templates de página.

## Tecnologias Prováveis

- **Next.js/React**: Framework front-end
- **TypeScript**: Tipagem estática
- **CSS Moderno**: Provavelmente Tailwind CSS ou styled-components
- **Estado**: Context API ou outra solução de gerenciamento de estado

## Configuração

Para configurar o projeto em sua máquina local, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/wt-admin.git
   cd wt-admin
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias:
   ```
   NEXT_PUBLIC_API_URL=sua_url_api
   # Outras variáveis de ambiente necessárias
   ```

## Executando o Projeto

Para rodar a aplicação em modo de desenvolvimento:

```bash
yarn dev
```

O projeto estará disponível em `http://localhost:3000`.

Para build de produção:

```bash
yarn build
yarn start
```

## Contribuição

Para contribuir com o projeto:

1. Crie um branch com o nome da feature (`feature/nome-da-feature`)
2. Desenvolva e teste suas alterações
3. Faça commit seguindo as convenções do projeto
4. Abra um Pull Request para revisão

## Observações

Projeto criado para ter como modelo base!