Aqui está o conteúdo formatado em Markdown para seu README:

# Dolado Frontend Test

## Experiência de desenvolvimento

Desenvolver esse projeto foi uma experiência muito positiva. Desde o início, busquei entregar uma solução fluida, com foco em clareza de código, arquitetura simples e uma boa experiência para o usuário. Trabalhar com mocks fixos exigiu atenção especial à forma como a conversa se desenrola, e por isso implementei uma simulação de digitação para tornar a interação mais natural.

## Decisões técnicas

- **Zustand** foi escolhido para o gerenciamento de estado por ser leve, direto e muito eficiente para fluxos conversacionais
- Estruturei o projeto para suportar múltiplas conversas simultâneas, permitindo histórico e alternância entre conversas
- A exibição das mensagens foi refinada com animações suaves e delays controlados, simulando uma IA real
- A separação entre UI, estado e dados foi mantida de forma clara para facilitar manutenção e leitura

## Testes

Os testes foram escritos com **Vitest** e cobrem o gerenciamento de estado do chat. Testam criação de conversas, navegação entre elas, fluxo de mensagens e reset do estado. O mock do fluxo de conversa garante que os testes sejam consistentes e previsíveis.

## Organização do projeto

```bash
src/
├─ components/      # Componentes reutilizáveis da interface
├─ store/           # Estado global com Zustand
├─ mocks/           # Fluxo da conversa baseado em JSON
├─ types/           # Tipagens do sistema
├─ tests/           # Testes dos fluxos do chat
├─ app/             # Estrutura base do Next.js
```

## Como rodar o projeto

```bash
# Instale as dependências
yarn install

# Rode o projeto em ambiente de desenvolvimento
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`.
