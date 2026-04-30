# Análise Crítica da Arquitetura Atual - Pokédex

## 1. Estrutura de Diretórios
**A organização atual dos arquivos em screens, components, services, etc., é clara para você?**
Sim, a atual divisão dos arquivos nas pastas `screens`, `components`, `services` e `utils` ficou bem clara, seprando as responsabilidades principais: `screens` contém as telas e rotas, `components` possuindo partes reutilizaveis de interfaces, `services` concentra a lógica de comunicação com a API externa e `utils` guarda funções utilitárias ou de formatação.

**Você mudaria algum arquivo de lugar? Por quê?**
Eu adicionaria uma pasta `types` para centralizar as tipagens do TypeScript. Atualmente, interfaces como a `Pokemon` estão definidas diretamente no arquivo do componente (como em `PokedexScreen.tsx`), e há muito uso do tipo `any` (como em `PokemonDetailScreen.tsx`). Ter uma pasta de tipos bem definida para o retorno da PokéAPI deixaria o código mais organizado.

## 2. Componentização
**O `PokemonCard` é um bom exemplo de componente reutilizável?**
Sim. Ele é simples e possui apenas uma responsabilidade. Recebe os dados de que precisa através de `props` (`name`), tornando-o perfeitamente reutilizável em qualquer outra tela que necessite listar Pokémons.

**Analise a tela `PokemonDetailsScreen`. Que partes dela você extrairia para um novo componente reutilizável para manter a tela mais limpa?**
A `PokemonDetailScreen` é um caso de "Fat Component", acumulando muita UI e lógica. Para limpá-la, eu extrairia os seguintes componentes:
- **`PokemonTypeBadge`**: A parte que faz o `.map()` nos tipos do Pokémon e renderiza a pequena "pílula" (`typeBadge`). Isso poderia facilmente ser reutilizado na própria `PokedexScreen` no futuro.
- **`PokemonStatsCard`**: O bloco de UI que engloba a Altura (`height`) e Peso (`weight`).
- **`PokemonAboutCard`**: A sessão que exibe a "Sobre" e a descrição textual formatada.
- **`PokemonImage`**: Apenas a exibição da imagem com os estilos de container arredondado e sombras.

## 3. Gerenciamento de Estado e Lógica
**Na `PokedexScreen`, onde a lógica de busca e filtragem de dados está localizada?**
Toda a lógica está acoplada dentro do próprio componente de UI `PokedexScreen`. O estado que armazena os dados (`pokemons`), o termo de pesquisa (`search`), a lógica que deriva a lista final filtrada (`filteredPokemons`) e as funções que fazem as chamadas à API (`loadData` e `loadMorePokemons` via `useEffect`) rodam juntas no escopo da tela.

**Na `PokemonDetailsScreen`, onde está a lógica para buscar os detalhes de um Pokémon específico?**
De maneira idêntica, a lógica encontra-se dentro de um `useEffect` da própria tela, que invoca `getPokemonDetails` e `getPokemonSpecies` usando o `pokemonName` retirado dos parâmetros da rota. O componente também gerencia os seus próprios estados de `loading`, `details`, `species` e `error`.

**Você considera essa abordagem (lógica de estado e de dados dentro dos componentes de tela) sustentável para um aplicativo que continua crescendo? Quais são os prós e contras que você observa?**
Não, não é uma abordagem sustentável para um aplicativo em crescimento.
- **Prós**: É simples de entender, rápido para implementar em protótipos ou projetos pequenos e não requer a adição de bibliotecas complexas.
- **Contras**: Mistura a lógica de negócios e estado de rede com a renderização visual, violando o princípio de responsabilidade única. A tela deveria ser apenas uma especificação do que exibir, mas atualmente contém toda a implementação (cálculos de filtro e requisições), dificultando testes e assim a manutenção.

## 4. Pontos Fortes e Fracos
**Pontos Fortes (o que foi bem feito):**
1. **Isolamento de Serviços (API)**: Ter as chamadas usando o `fetch` encapsuladas na pasta `services/api.ts` é uma ótima prática. Isso abstrai os detalhes da requisição (URL, cabeçalhos) dos componentes e facilita manutenções futuras.
2. **Uso adequado do `StyleSheet`**: Os componentes evitam o uso demasiado de "inline styles" e definem um objeto `StyleSheet.create` no fim do arquivo. Isso deixa o JSX (árvore visual) mais limpo e melhora a performance de renderização no React Native.

**Pontos Fracos (o que poderia ser melhorado):**
1. **Repetição de lógica assíncrona ("Boilerplate" de Fetch)**: Ambas as telas possuem um bloco enorme de gerenciar `loading`, `data` e `error` atrelado a um `useEffect`. Isso poderia ser resolvido adotando o padrão MVVM, onde toda a lógica de useState e useEffect é extraída para um arquivo de ViewModel (como usePokedexViewModel) , garantindo que a View não contenha nenhum useState diretamente.
2. **Tipagem do TypeScript negligenciada em pontos chave**: Na `PokemonDetailScreen`, praticamente todos os estados cruciais e dados mapeados utilizam `any` (ex: `useState<any>`, `entry: any`). Isso neutraliza o principal benefício do TypeScript, que é garantir segurança e autocompletar em tempo de desenvolvimento. Modelar interfaces (Types) adequadas para o retorno da PokeAPI seria uma grande melhoria.


# Proposta de Refatoração para MVP ou MVVM

## 1. Padrão Escolhido: 
*Declare qual padrão você escolheu (MVP ou MVVM) e justifique brevemente por que o considera uma boa opção para este aplicativo.*
*R:* **MVVM (Model-View-ViewModel)**  
Escolhi o MVVM porque ele encaixa muito bem com o React Native usando Custom Hooks. A ideia é tirar toda a lógica da PokedexScreen e deixar ela cuidando só da parte visual. Isso deixa o código bem mais limpo de dar manutenção e facilita muito se a gente precisar testar a lógica de busca depois, já que ela não fica amarrada na renderização da tela

## 2. Nova Estrutura de Arquivos:
*Desenhe a nova estrutura de diretórios para a tela da Pokédex. Mostre onde os novos arquivos (como PokedexPresenter.ts ou usePokedexViewModel.ts) estariam localizados.*
*R:*
PokedexApp/  
└─ src/  
   ├─ screens/  
   │  └─ Pokedex/  
   │     ├─ PokedexScreen.tsx       <-- só a parte visual  
   │     └─ usePokedexViewModel.ts  <-- toda a lógica e estados  
   ├─ components/                   <-- componentes globais que possam reutilizaveis(ex: PokemonCard)  
   ├─ services/                     <-- comunicação com a api  
   ├─ utils/                        <-- funções de ajuda (formatador de tesxto, datas...)  
   └─ types/                        <-- tipos do TypeScript  
      └─ pokemon.ts  

## 3. Divisão de Responsabilidades:
- *O que ficaria na View (PokedexScreen.tsx)? Como ela consumiria o ViewModel?*
*R:*Ficaria apenas a parte visual (componentes como View, Text, FlatList e os estilos). Zero lógica de negócio, sem nenhum useState ou useEffect.  
const { filteredList, isLoading, searchQuery, setSearchQuery } = usePokedexViewModel();
- *O que ficaria no ViewModel (ex: usePokedexViewModel)? Quais estados (list, isLoading) e funções (setSearchQuery) ele exporia?*
*R: *No ViewModel ficaria toda a lógica nececessária para gerenciar os dados da tela, incluindo os hooks useState para a lista e para a busca, o useEffect que faz o fetch na API e a lógica que filtra o array de Pokémons em tempo real. Ele mostra para a View apenas o que ela precisa para se desenhar, como os estados da lista já filtrada (list), o status de carregamento (isLoading), o termo atual da pesquisa (searchQuery) e possíveis mensagens de erro, além das funções setSearchQuery, para atualizar o campo de busca, e loadMore, para buscar a próxima página de dados.

## 4. Fluxo de Dados:
(Usuário digita Pikachu)  
          |  
          v  
(View)  
  Aciona a função setSearchQuery() do Hook  
          |  
          v  
(ViewModel)  
  Filtra a lista original (em memória) e atualiza a 'filteredList'  
          |  
          v  
(View)  
  Recebe a 'filteredList' atualizada e mostra na FlatList  
