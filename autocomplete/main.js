const names = ['Michel', 'Verona', 'Giovanna', 'Haroldo', 'Lucas', 'Larissa', 'Gustavo', 'Luis', 'Biscoito', 'Victor', 'Veronica', 'Velma'];

const nameInput = document.getElementById('nameInput')
const dropdown = document.getElementById('dropdown')

nameInput.addEventListener('input', () => {
    console.log('NAME INPUT: ', nameInput.value)
    const input = nameInput.value.trim().toLowerCase();
    
    if (!input) {
        dropdown.style.display = 'none';
        return;
    }    
    const filteredNames = names.filter((name) => {
        return name.trim().toLowerCase().startsWith(input);
    })

    if (filteredNames.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredNames.forEach(name => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = name;
      fragment.appendChild(item);
    });
    dropdown.replaceChildren(fragment);
    
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        nameInput.value = item.textContent;
        dropdown.style.display = 'none';
      }
    });

    dropdown.style.display = 'block';
})