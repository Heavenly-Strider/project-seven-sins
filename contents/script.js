/* Собирает содержание по грехам и связывает материалы с читалкой. */

(() => {
  // Порядок групп содержания совпадает с порядком в архиве.
  const sins = ['Гнев', 'Гордыня', 'Зависть', 'Похоть', 'Лень', 'Жадность', 'Чревоугодие'];
  const materials = Array.isArray(window.PSS_MATERIALS) ? window.PSS_MATERIALS : [];
  const themes = window.PSS_SIN_THEMES || {};
  const host = document.getElementById('sin-list');
  host.replaceChildren();

  // Создаёт раскрывающуюся группу для каждого греха.
  sins.forEach((sin, index) => {
    const theme = themes[sin] || {};
    const group = document.createElement('details');
    group.className = 'sin-group';
    group.style.setProperty('--sin-accent', theme.accent || '#9AA3AC');
    group.style.setProperty('--sin-border', theme.border || '#292e33');
    group.style.setProperty('--sin-panel', theme.panel || '#131619');
    group.style.setProperty('--sin-panel-light', theme.panelLight || '#191d21');

    const summary = document.createElement('summary');
    const name = document.createElement('span');
    name.className = 'sin-name';
    name.textContent = `${String(index + 1).padStart(2, '0')} / ${sin}`;
    const count = document.createElement('span');
    count.className = 'sin-count';
    const items = materials.filter(item => item && item.sin === sin);
    count.textContent = `${String(items.length).padStart(2, '0')} МАТЕРИАЛОВ`;
    summary.append(name, count);
    group.append(summary);

    const list = document.createElement('div');
    list.className = 'sin-items';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'sin-empty';
      empty.textContent = 'Материалы этой группы пока не добавлены.';
      list.append(empty);
    } else {
      items.forEach(item => {
        const link = document.createElement('a');
        link.href = `../reading/index.html?id=${encodeURIComponent(item.id)}`;
        const label = document.createElement('span');
        label.textContent = item.title;
        const type = document.createElement('span');
        type.className = 'sin-type';
        type.textContent = item.type === 'document' ? 'Документ →' : 'Глава →';
        link.append(label, type);
        list.append(link);
      });
    }
    group.append(list);
    host.append(group);
  });
})();
