class Game {
    constructor() {
        this.board = document.getElementById('board');
        this.status = document.getElementById('status');
        this.gameContainer = document.getElementById('game');
        this.modal = document.getElementById('help-modal');
        this.closeBtn = document.querySelector('#close');
        this.cells = [];
        this.currentPlayer = 'X';
        this.gameState = [];
        this.gameActive = false;
        this.size = 3;
        this.aiMode = false;
        
        document.getElementById('new-game').addEventListener('click', () => {
            this.aiMode = false
            this.initializeGame();
        });
        document.getElementById('restart').addEventListener('click', () => this.restartGame());
        document.getElementById('help').addEventListener('click', () => this.showHelp());
        document.getElementById('toggle-ai').addEventListener('click', () => {
            this.aiMode = true
            this.initializeGame();
        });
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
            this.status.textContent = "Deu velha! ):";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();

        if (this.aiMode && this.gameActive) {
            setTimeout(() => this.aiMove(), 500); 
        }
    }

    aiMove() {
        const bestMove = this.findBestMove();
        if (bestMove === -1) return;

        this.gameState[bestMove] = 'O';
        this.board.children[bestMove].textContent = 'O';

        if (this.checkWin()) {
            this.status.textContent = "AI venceu!";
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            this.status.textContent = "Deu velha! ):";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = 'X';
        this.updateStatus();
    }
    
    findBestMove() {
        let bestScore = -2;
        let bestMove = -1;

        for (let i = 0; i < this.size * this.size; i++) {
            if (this.gameState[i] === '') {
                this.gameState[i] = 'O';
                const score = this.minimax(false);
                this.gameState[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    minimax(isMaximizing) {
        if (this.isWinner('O')) return 1;
        if (this.isWinner('X')) return -1;
        if (this.checkDraw()) return 0;

        if (isMaximizing) {
            let bestScore = -2;
            for (let i = 0; i < this.size * this.size; i++) {
                if (this.gameState[i] === '') {
                    this.gameState[i] = 'O';
                    const score = this.minimax(false);
                    this.gameState[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = 2;
            for (let i = 0; i < this.size * this.size; i++) {
                if (this.gameState[i] === '') {
                    this.gameState[i] = 'X';
                    const score = this.minimax(true);
                    this.gameState[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWin() {
        const lines = this.getLines();
        return lines.some(line => 
            line.every(index => this.gameState[index] === this.currentPlayer)
        );
    }

    isWinner(player) {
        return this.getLines().some(line => 
            line.every(index => this.gameState[index] === player)
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