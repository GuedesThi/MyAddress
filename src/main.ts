const botaoEnviarCep = document.getElementById('botao') as HTMLButtonElement;
const cepInput = document.getElementById('cep') as HTMLInputElement;
const containerParaAtivar = document.querySelector('.respostaContainer') as HTMLDivElement;
const botaoFechar = document.querySelector('#botaoFechar') as HTMLButtonElement;
const espacoColocarResposta = document.querySelector('.resposta') as HTMLDivElement;

/*------------------------------------------------------------------------------------------------------*/

botaoEnviarCep?.addEventListener('click', () => {
  const cep: string = cepInput.value;
  comunicao_api(cep);
})

botaoFechar?.addEventListener('click', () => {
  containerParaAtivar.classList.remove('ativo');
  espacoColocarResposta.innerHTML = '';
})

/*------------------------------------------------------------------------------------------------------*/
const keyMap: { [key in keyof Endereco]: string } = {
  cep: 'CEP',
  logradouro: 'Endereço',
  complemento: 'Complemento',
  localidade: 'Bairro',
  uf: 'Estado'
};

/*------------------------------------------------------------------------------------------------------*/

async function comunicao_api(cep: string) {
  //const url: string = 'http://localhost:4545/?cep=' + cep;
  const url: string = 'https://api-myaddress.onrender.com/';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cep: cep })
    });
      
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CEP não encontrado');
      } else {
        throw new Error('Erro ao buscar o CEP');
      }
    }

    const data: Endereco = await response.json();
    espacoColocarResposta.innerHTML = '';

    // Verifica se todos os valores no objeto data são null
    const allNullValues = Object.values(data).every(value => value === null);

    if (allNullValues) {
      if (!containerParaAtivar.classList.contains('ativo')) {
        containerParaAtivar.classList.add('ativo');
      }
      const paragrafo: HTMLParagraphElement = document.createElement('p');
      paragrafo.innerHTML = 'O CEP informado não existe. Tente outro.';
      espacoColocarResposta.appendChild(paragrafo);
      
    } else {
      if (!containerParaAtivar.classList.contains('ativo')) {
        containerParaAtivar.classList.add('ativo');
      }

      Object.keys(data).forEach(key => {
        const paragrafo: HTMLParagraphElement = document.createElement('p');
        paragrafo.innerHTML = `${keyMap[key as keyof Endereco]}: ${data[key as keyof Endereco] || 'Não disponível'}`;
        espacoColocarResposta.appendChild(paragrafo);
      });
    }

  } catch (e) {
    console.error('Houve um erro: ' + e);
    espacoColocarResposta.innerHTML = '';
    const errorParagrafo: HTMLParagraphElement = document.createElement('p');
    errorParagrafo.innerHTML = 'O CEP informado não existe. Tente outro.';
    espacoColocarResposta.appendChild(errorParagrafo);

    if (!containerParaAtivar.classList.contains('ativo')) {
      containerParaAtivar.classList.add('ativo');
    }
  }
}
