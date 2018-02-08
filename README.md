# Cerveja com que
Projeto de Google Assistente para harmonização de cerveja

## Passos para o DialogFlow

1. Utilize o [Actions on Google Console](https://console.actions.google.com/) para adicionar um novo projeto com o nome que você quiser.
1. Em _Build a custom app_, clique em _BUILD_ no card do DialogFlow e então clique em _Create Actions on DialogFlow_.
1. Salve o projeto.
1. Vá no _project settings_.
1. Clique _Export and Import_.
1. Então clique em _Restore from ZIP_ e restaure o projeto do arquivo ```CervejaComQue.zip``` na raiz deste repositório.
1. De deploy do código no diretório ```Functions```usando [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).
1. Vá no console do DialogFlow, clique em _Fulfillment_ no menu do lado esquerdo, ative _Webhook_ e coloque o valor da _URL_ para o caminho do serviço criado no passo anterior, então salve.
1. Clique em integrations no menu do lado esquerdo, vá no _Integration settings_ do Google Assitant, clique _Test_ e depois _Continue_. Pronto, agora é só testar.
