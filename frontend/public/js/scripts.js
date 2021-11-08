// buscar o elemento no html da minha lista onde irei inserir as animes
const lista = document.getElementById('lista')

// atribuindo a endpoint da api do backend em um constante
const apiUrl = 'http://localhost:3000/animes';

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// pegar os dados que o usuario digita no input (Elementos)
let nome = document.getElementById('nome');
let imagem = document.getElementById('imagem');
let genero = document.getElementById('genero');
let nota = document.getElementById('nota');
let status_anime = document.getElementById('status_anime');

// faz uma resquisicao do tipo [GET] para o back que recebe todos os animes cadastrados
const getAnimes = async () => {
    // FETCH API api do javascript responsavel por fazer comunicacao entre requicoes http.
    const response = await fetch(apiUrl)
    
    // é a lista de objetos animes (array de objetos)
    const animes = await response.json(); 

    animes.map((anime) => {
        lista.insertAdjacentHTML('beforeend', `
        <div class="card">
        
        <h5 id="texto_nome">${anime.nome}</h5>
        
            <img src="${anime.imagem}" id="imagem_card" alt="...">
                <div>                    
                    <h5 id="texto_genero">Gênero: ${anime.genero}</h5>
                    <h5 id="texto_nota">NOTA: ${anime.nota}</h5>
                    <h5 id="texto_status">Status: ${anime.status_anime}</h5>                
                    <div id="botoes_card">
                        <button id="btn_edit" onclick="editAnime('${anime.id}')">Editar</button>
                        <button id="btn_excluir" onclick="deleteAnime('${anime.id}')">Excluir</button>
                    </div>
                </div>            
        </div>
        `)
    })
}

// [POST] envia uma anime para o backend para ser cadastrada

const submitForm = async (event) => {
    // previnir que o navegador atualiza a pagina por causa o evento de submit
    event.preventDefault();

    // Estamos construindo um objeto com os valores que estamos pegando no input.
    const anime = {
        nome: nome.value,
        imagem: imagem.value,
        genero: genero.value,
        nota: nota.value,
        status_anime: status_anime.value,       
    }
    // é o objeto preenchido com os valores digitados no input

    if(edicao) {
        await putAnime(anime, idEdicao);
    } else {
        await createAnime(anime);
    }

    clearFields();
    lista.innerHTML = '';
}

const createAnime = async(anime) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(anime),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    // anime cadastrado com sucesso.
    getAnimes();

}

const putAnime = async(anime, id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(anime),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getAnimes();
}

// [DELETE] funcao que exclui um anime de acordo com o seu id
const deleteAnime = async (id) => {
    // construir a requiscao de delete
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    })

    const response = await fetch(request);
    const result = await response.json();

    alert(result.message);
    
    lista.innerHTML = '';
    getAnimes();
}

// [GET] /anime/{id} - funcao onde recebe um id via paramtero envia uma requisicao para o backend
// e retorna a anime de acordo com esse id.
const getAnimeById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}

// ao clicar no botao editar
// ela vai preencher os campos dos inputs
// para montar o objeto para ser editado
const editAnime = async (id) => {
    // habilitando o modo de edicao e enviando o id para variavel global de edicao.
    edicao = true;
    idEdicao = id;

    //precismo buscar a informacao da anime por id para popular os campos
    // salva os dados da anime que vamos editar na variavel anime.
    const anime = await getAnimeById(id);

    //preencher os campos de acordo com a anime que vamos editar.
    nome.value = anime.nome;
    imagem.value = anime.imagem;
    genero.value = anime.genero;
    nota.value = anime.nota;
    status_anime.value = anime.status_anime;    
}

const clearFields = () => {
    nome.value = '';
    imagem.value = '';
    genero.value = '';
    nota.value = '';
    status_anime.value = '';    
}

getAnimes();