class Game {
    constructor() {
        this.board = document.getElementById('board');
        this.status = document.getElementById('status');
        this.gridSizeInput = document.getElementById('grid-size');
        this.gameContainer = document.getElementById('game');
        this.modal = document.getElementById('help-modal');
        this.closeBtn = document.querySelector('#close');
        this.cells = [];
        this.currentPlayer = 'X';
        this.gameState = [];
        this.gameActive = false;
        this.size = 3;

        document.getElementById('new-game').addEventListener('click', () => this.initializeGame());
        document.getElementById('restart').addEventListener('click', () => this.restartGame());
        document.getElementById('help').addEventListener('click', () => this.showHelp());
        this.closeBtn.addEventListener('click', () => this.closeHelp());
            window.addEventListener('click', (e) => {
            if (e.target === this.modal) 
                this.closeHelp();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape')
                this.closeHelp();
        });
    }

    initializeGame() {
        this.size = parseInt(this.gridSizeInput.value);
        if (this.size < 3 || this.size > 9) {
            alert('O tamanho do tabuleiro deve estar entre 3 e 9!');
            return ;
        }
        this.createBoard();
        this.gameActive = true;
        this.gameContainer.classList.remove('hidden');
        this.updateStatus();
    }

    createBoard() {
        this.board.style.gridTemplateColumns = `repeat(${this.size}, var(--cell-size))`;
        this.board.innerHTML = '';
        this.gameState = Array(this.size * this.size).fill('');
        
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', (e) => this.handleMove(e));
            this.board.appendChild(cell);
        }
      }
    
    handleMove(e) {
        if (!this.gameActive) return;
        
        const index = parseInt(e.target.dataset.index);
        if (this.gameState[index]) return;

        this.gameState[index] = this.currentPlayer;
        e.target.textContent = this.currentPlayer;

        if (this.checkWin()) {
            this.status.textContent = `Jogador ${this.currentPlayer} venceu!`;
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            this.status.textContent = "Empate! ):";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }
    
    checkWin() {
        const lines = this.getLines();
        return lines.some(line => 
            line.every(index => this.gameState[index] === this.currentPlayer)
        );
    }
    
    getLines() {
        const lines = [];
        for (let row = 0; row < this.size; row++) {
            lines.push(Array.from({length: this.size}, (_, col) => row * this.size + col));
        }
        for (let col = 0; col < this.size; col++) {
            lines.push(Array.from({length: this.size}, (_, row) => row * this.size + col));
        }
        lines.push(Array.from({length: this.size}, (_, i) => i * (this.size + 1)));
        lines.push(Array.from({length: this.size}, (_, i) => (i + 1) * (this.size - 1)));
        return lines;
    }
    
    checkDraw() {
        return this.gameState.every(cell => cell !== '');
    }

    updateStatus() {
        this.status.textContent = `Sua vez, jogador ${this.currentPlayer}!`;
    }
    
    restartGame() {
        this.gameActive = false;
        this.currentPlayer = 'X';
        this.initializeGame();
    }
    
    showHelp() {
        const winLengthText = this.modal.querySelector('li:nth-child(2)');
        winLengthText.innerHTML = `Win by getting <strong>${this.winLength}</strong> in a row`;
        
        this.modal.classList.remove('hidden');
    }
    
    closeHelp() {
        this.modal.classList.add('hidden');
    }
}
    
new Game();