$(document).ready(function(){
	// Evento que vai monitorar qualquer 
	// pressionamento de tecla
	$(document).keydown(function(event) {
		keyPressedMapper(event);
	}); 
	// Acao que sera chamada quando o cara apertar start
	$('#macro').click(function(){startNavigation()});
	$('#ok').click(function(){selectOption()});
	// Acao que sera chamada quando o cara apertar os botoes up e down
	$('#ArrowUp').click(function(){keyPressed('ArrowUp')});
	$('#ArrowDown').click(function(){keyPressed('ArrowDown')});
	$('#keyboard .button').each(function(index, element){
		var button = $(element);
		var id = button.attr('id');
		button.click(function(){virtualKeyboardPressed(id)});
	});
	// Inicia o device, mostrando a hora
	startDevice();
});

function startDevice(){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10){
		minutes = '0' + minutes;
	}
	$('#title').html('<div class="time">' + hours + ':' + minutes + '</div>');
}

// Acao chamada quando o cara clica em ok
function selectOption(){
	// Verifica se a navegacao foi iniciada
	if ($('#navigationOptions').find('.current-menu').length) {
		var currentOption = $('#navigationOptions').find('.current-option');
		var currentMenu = $('#navigationOptions').find('.current-menu');
		var nextItem;
		// Primeiro verifica se na opcao escolhida há uma navegacao definida attr next
		if (currentOption.attr('on-enter')) {
			nextItem = currentOption.attr('on-enter');
		} 
		// Senao pega a proxima navegacao definida no elemento pai
		else {
			nextItem = currentMenu.attr('on-enter');
		}
		// Remove as classes anteriores
		$('#navigationOptions').find('li').removeClass('current-menu');
		$('#navigationOptions').find('li').removeClass('current-option');
		var menu = $('#' + nextItem);
		if (menu.length) {
			menu.addClass('current-menu');
			var firstOption = $(menu).find('ul > li')[0];
			// Verifica se o item possui subitens
			if (firstOption) {
				$(firstOption).addClass('current-option');
				// Verifica se tem um input e remove os valores
				var input = $('#navigationOptions').find('.current-option input');
				if (input.length) {
					$(input).val('');
				}
			} 
			// Caso contrario o titulo sera o pai do elemento
			else {
				$('#navigationOptions').find('li').removeClass('current-menu');
				$('#navigationOptions').find('li').removeClass('current-option');
				$('#006_007').parent().parent().addClass('current-menu');
				menu.addClass('current-option');
			}
			printCurrent();
		}
	} 
}

// Metodo que vai simular os botoes do teclado virtual - numeros
function virtualKeyboardPressed(key){
	keyPressedMapper({key:key});
}

// Metodo que so mapeia a tecla apertada e chama 
// a funcao passando o nome da tecla
function keyPressedMapper(event){
	// Verifica se o cara pressionou as teclas pra cima ou pra baixo
	if (event.key === 'ArrowUp' || event.key == 'ArrowDown') {
		keyPressed(event.key);
	} else if (event.key === 'Enter') {
		selectOption();
	} else {
		// Senao pega o input pressionado
		// Verifica se eh um numero
		if (!isNaN(event.key)) {
			var number = event.key;
			keyPressed(number);
			// Verifica se a opcao atual eh uma entrada de valores
			var input = $('#navigationOptions').find('.current-option input');
			if (input.length) {
				// Adiciona o valor no input
				var currentVal = $(input).val();
				// Limita a entrada para no maximo 5 caracteres
				if (currentVal.length < 5){
					$(input).val(currentVal + '' + number);	
				}
				// Imprime tudo
				printCurrent();
			}
		}
	}
}

// Metodo que vai acender o botao
function keyPressed(key){
	// Adiciona a classe `highlight` para no elemento 
	// correspondente a tecla pressionada
	var elementId = '#' + key;
	$(elementId).addClass('highlight');
	// Remove the class `highlight` 
	// de todos os elementos apos 0.5 segundos
	setTimeout(function(){
		$('.button').removeClass('highlight');
	}, 500);
	// Navega no menu
	if (key === 'ArrowUp' || key == 'ArrowDown') {
		navigateOptions(key);
	}
}

function startNavigation(){
	// Remove a class current-menu e current-option do item atual caso exista
	$('#navigationOptions').find('li').removeClass('current-menu');
	$('#navigationOptions').find('li').removeClass('current-option');
	// Adiciona a class-menu current no primeiro item
	var firstItem = $('#navigationOptions').find('li')[0];
	$(firstItem).addClass('current-menu');
	// Pega a primeira opcao do menu
	var firstOption = $(firstItem).find('ul > li')[0];
	$(firstOption).addClass('current-option');
	// Chama o metodo que vai colocar opcao escolhida na tela
	printCurrent();
}

// Metodo que vai navegar entre as opcoes
function navigateOptions(direction){
	// Verifica se a navegacao foi iniciada
	if ($('#navigationOptions').find('.current-option').length) {

		// Verifica se o item atual permite navegacao
		var current = $('#navigationOptions').find('.current-option')[0];
		if ($(current).is('[block-nav]')) {
			return;
		}

		// Se esta navegando pra baixo pega o proximo item
		var option, index;
		var options = $('#navigationOptions').find('.current-option').parent().find('>li');
		// Pega o indice a opcao atual
		if (options && options.length) {
			for (var i = 0; i < options.length; i++) {
				if ($(options[i]).hasClass('current-option')) {
					index = i;
				}
			}
		}
		if (direction === 'ArrowDown') {
			index++;
			for (var i = index; i < options.length; i++) {
					if (!$(options[i]).is('[hide-on-nav]')) {
						option = options[i];
						break;
					}
			}
		} else {
			index--;
			for (var i = index; i >= 0; i--) {
				if (!$(options[i]).is('[hide-on-nav]')) {
					option = options[i];
					break;
				}
			}
		}
		console.log('option',option);
		// Verifica se o item eh valido
		if (option) {
			var option = $(option);
			$('#navigationOptions').find('li').removeClass('current-option');
			// Marca o item selecionado como atual
			option.addClass('current-option');
			// Coloca o item na tela
			printCurrent();
		}
	} 
}

// Metodo que vai pegar o menu e a opcao atual e escreve na tela
function printCurrent(){
	var title = $('#navigationOptions').find('.current-menu > div').text();
	$('#title').html(title);
	var option = $('#navigationOptions').find('.current-option > div').text();
	var input = $('#navigationOptions').find('.current-option > div > input');
	// verifica se tem um input, para entrar parametros
	if (input.length) {
		var value = $(input).val();
		var pad = 4;
		var length = value.length;
		var text = '';
		for (var i = length; i <= pad; i++) {
			text += '&nbsp;';
		}
		text += value;
		option += '[' + text +  ']';
	}
	$('#content').html(option);	
}

