# Template básico Angular para sites estáticos

Esse é um pequeno template para acelerar o processo de desenvolvimento web. Como é comum a maioria dos projetos realizados por nós ultimamente. Ele tem o objetivo de automatizar algo que se tornou padrão para a criação de um novo website simples com angular. 

## Dependências

Se faz necessário gerenciar as depências do projeto. Para isso utilizamos o [Bower](http://bower.io/). Caso não o tenha em sua máquina instale e execute os comandos necessários para a instalação de todas os pacotes de terceiros. 

### Instalando o Bower

Bower é uma interface de linha de comando. Instale com o npm.

``` bash
$ npm install -g bower 
```
### Instalando as dependências do projeto

O Bower irá instalar os pacote na pastar vendor. Para isso execute o seguinte comando. 

``` bash
$ bower install
```
### Todas as dependências

Segue abaixo a lista de todas as bibliotecas de terceiros utilizadas nesse projeto.

* JS
  * [Angular](https://github.com/angular/bower-angular)
  * [Angular-route](https://github.com/angular/bower-angular-route)
* CSS
  * [1140px-responsive-css-grid](https://github.com/aosmialowski/1140px-Responsive-CSS-Grid)
  * [Fontawesome](https://github.com/FortAwesome/Font-Awesome)

## Rodando o projeto localmente

Apesar de não ter nenhum código backend. Ainda é necessário utilizar um servidor http para poder trabalhar com esse projeto no seu navegador. O motivo disso é o angular-route. Utilizamos o seu serviço de rotas  e não é possível acessar essas rotas sem um servidor. 

### Serve com o Nodefront

Qualquer servidor http cairia bem. Particularmente utilizamos o [Nodefront](http://karthikv.github.io/nodefront/) por ser simples e resolver nossas necessidades. Nodefront é um módulo no node. Para instalar execute o comando abaixo no seu terminal.

``` bash
$ npm install -g nodefront
```

Para executar o servidor entre na pasta do projeto e digite. 

``` bash
$ nodefront serve -l
```
Coloque o endereço ``localhost:3000`` no navegador e verá o projeto funcionando 100%. A opção ``-l``  passada como parâmetro diz para o nodefront que qualquer alteração do css deve ser aplicada automaticamente. E qualquer mudança no html fará o servidor atualizar a página no navegador automaticamente também. 
