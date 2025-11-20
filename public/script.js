// Taxa de juros mensal genérica para a simulação
const TAXA_SIMULACAO = 0.02; // 2.0% ao mês

function calcularParcela() {
    // Pega os valores do formulário de simulação
    let valorInput = document.getElementById('valor_interesse');
    let prazoInput = document.getElementById('prazo');
    let parcelaOutput = document.getElementById('valor_parcela');
    
    // Converte para números
    let valor = parseFloat(valorInput.value);
    let prazo = parseInt(prazoInput.value);
    
    if (valor > 0 && prazo > 0) {
        // Fórmula Simplificada (Apenas para Simulação Genérica)
        let parcela = (valor * (1 + TAXA_SIMULACAO * prazo)) / prazo;
        
        // Exibe o valor formatado com 2 casas decimais
        parcelaOutput.value = parcela.toFixed(2);
    } else {
        parcelaOutput.value = '';
    }
}