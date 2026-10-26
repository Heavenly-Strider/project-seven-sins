/* Формирует архив персонажей и обработку фильтров архива. */
const characters = [
    {
        id: "001",
        name: "Леорин Таллас",
        alias: "Скиталец",
        sin: "Гнев",

        image: "",
        appearance: "Белые волосы, бледная кожа, слепые глаза, скрытые потрёпанным бинтом, и ожог от удара молнии у правого глаза. Атлетичное телосложение, рост около двух метров, тело покрыто шрамами. Обычно носит одежду, сочетающую академическую униформу и мундир в бело-золотых тонах.",

        personality: "Леорин Таллас, некогда обычный смертный и странник, помогавший жителям Острейи, стал божеством правосудия. Он искренне сочувствует людям, но остаётся отстранённым и необщительным. Беспристрастен и судит по существу дела. Бинт на его глазах служит печатью, сдерживающей силу. При несправедливости или опасности она может быть сорвана, и Скиталец теряет контроль над собой. Он испытывает как собственный гнев, так и гнев пострадавших, а его физическая и энергетическая сила растёт экспоненциально, пока контроль не будет восстановлен. После этого он испытывает физическое и энергетическое истощение.",

        universe: "Острейя представляет собой остров, окружённый необъятным океаном. Над островом простирается облачная гладь, представляющая собой пустыню из осязаемых облаков. Вокруг неё расположена грозовая пустошь, область гроз и опасности. Остров и облачную гладь соединяет Предел, физический пик, имеющий особое значение для устройства мира.",

        paletteName: "ПРИГЛУШЁННОЕ ЗОЛОТО",
        paletteColor: "#D6C7A0",

        theme: {
            background: "#151411",
            panel: "#211F19",
            panelLight: "#302B20",
            border: "#65583C",
            text: "#EEE8D8",
            muted: "#B5A98B",
            accent: "#D6C7A0",
            glow: "rgba(214, 199, 160, 0.14)",
            surface: "#1A1813",
            fieldBg: "#211E17",
            portraitStart: "#302B20",
            portraitEnd: "#151411"
        }
    },

    {
        id: "002",
        name: "Айзек Кведлер",
        alias: "Бегущий",
        sin: "Гордыня",

        image: "",
        appearance: "Каштановые волосы, классическая причёска с чёлкой и короткими боками. Чёрные спортивные штаны, багровая футболка, серая повязка-бафф на лице и шее, чёрные кроссовки с белыми подошвами. Поверх футболки носит незастёгнутую тёмно-зелёную кофту с капюшоном. Глаза отливают оранжевым, словно в них горит пламя.",

        personality: "Айзек холоден, отстранён и практически невозмутим. Его мышление отличается нечеловеческой скоростью и глубиной, а способность просчитывать последствия и контролировать себя укрепляет убеждённость в собственном превосходстве. Он доверяет прежде всего собственным выводам, не позволяет другим управлять собой и почти никогда не отступает от поставленной цели. Его гордыня проявляется в абсолютной уверенности в своих возможностях и превосходстве над большинством окружающих. Проведя в Бетонных дебрях более девятнадцати лет, Айзек стремится разгадать природу измерения и найти способ освободить от него других людей. При этом сам он покидать его не намерен, а собственные мотивы не раскрывает никому.",

        universe: "Бетонные дебри представляют собой измерение-ловушку, состоящее из бесчисленных недостроенных сооружений, образующих непрерывную бетонную поверхность. Оно уходит на неизвестную глубину, а туманное небо скрывает источник света. Пространство разделено на Верховой, Средний и Подвальный ярусы, каждый из которых обладает своими особенностями и опасностями. Здесь бродят враждебные гуманоидные роботы, встречаются другие попаданцы, борющиеся за выживание, и существуют пространственные разломы, работающие как порталы. Истинная природа измерения остаётся загадкой.",

        paletteName: "ТЁМНО-ЗЕЛЁНЫЙ",
        paletteColor: "#233D32",

        theme: {
            background: "#111713",
            panel: "#19271F",
            panelLight: "#233D32",
            border: "#3C5A49",
            text: "#E5E9DF",
            muted: "#9DAFA2",
            accent: "#80A58C",
            glow: "rgba(68, 112, 85, 0.20)",
            surface: "#141E18",
            fieldBg: "#1A2920",
            portraitStart: "#294738",
            portraitEnd: "#111713"
        }
    },

    {
        id: "003",
        name: "Терен Уитлок",
        alias: "Гробовщик",
        sin: "Зависть",

        image: "",
        appearance: "Короткие чёрные волосы, усталое лицо и суровое выражение. Обычное телосложение, внешность молодого человека примерно 18–25 лет. Носит серый плащ, под которым скрывается горчичный свитер, и носит с собой пожарный топор.",

        personality: "Терен доброжелателен, жизнерадостен и часто улыбается. Он любит шутить, поддерживать окружающих и облегчать тяжёлую атмосферу даже в безнадёжных обстоятельствах. Несмотря на общительность, редко сближается с людьми: ему мешают собственная Зависть, страх привязанности и ощущение, что он чужой среди остальных. Во время апокалипсиса Терен потерял всех друзей, а позже обнаружил, что невосприимчив к заражению. Его иммунитет не сопровождается другими изменениями организма и не защищает от физических ранений. Терен завидует людям, способным заразиться и умереть, хотя сам не хочет умирать и принимает смерть как естественную часть жизни. Он осознаёт свою Зависть, стыдится её и не считает оправданной, но не может избавиться от неё. Чувство постепенно накапливается, усиливается при сравнении себя с другими и иногда прорывается вспышками раздражения, ярости и отчаяния. Когда кто-то умирает, Терен искренне скорбит, а Зависть приходит позже, когда он остаётся один. Прозвище «Гробовщик» ему дали другие выжившие: собственными руками Терен похоронил десятки товарищей.",

        universe: "Мир переживает зомби-апокалипсис, причина которого известна автору, но остаётся неизвестной большинству выживших. Заражение передаётся через укусы, кровь и другие биологические жидкости. Существуют различные виды зомби, отличающиеся своими особенностями. Выжившие обитают в укреплённых поселениях и относительно безопасных зонах, создают организованные сообщества со своими правилами и иерархией, странствуют в поисках ресурсов или выживают в одиночку.",

        paletteName: "ГОРЧИЧНО-ЖЁЛТЫЙ",
        paletteColor: "#C9A33D",

        theme: {
            background: "#17150F",
            panel: "#282318",
            panelLight: "#3A301F",
            border: "#69572E",
            text: "#F0E7CF",
            muted: "#B7A77D",
            accent: "#C9A33D",
            glow: "rgba(201, 163, 61, 0.16)",
            surface: "#1D1911",
            fieldBg: "#292216",
            portraitStart: "#493B22",
            portraitEnd: "#17150F"
        }
    },

    {
        id: "004",
        name: "Лиам Харпер",
        alias: "Фрейм",
        sin: "Похоть",

        image: "",
        appearance: "Описание пока не добавлено.",

        personality: "Похоть выражена через тягу к насилию. Подробное описание личности пока не добавлено.",

        universe: "Описание вселенной пока не добавлено.",

        paletteName: "БАГРЯНО-КРАСНЫЙ",
        paletteColor: "#B84D64",

        theme: {
            background: "#171113",
            panel: "#26191D",
            panelLight: "#382027",
            border: "#633541",
            text: "#F0E1E4",
            muted: "#B99AA2",
            accent: "#C96B7E",
            glow: "rgba(184, 77, 100, 0.16)",
            surface: "#1D1417",
            fieldBg: "#281A1F",
            portraitStart: "#512936",
            portraitEnd: "#171113"
        }
    },

    {
        id: "005",
        name: "Ристо Каарель",
        alias: "Дрифт",
        sin: "Лень",

        image: "",
        appearance: "Описание пока не добавлено.",

        personality: "Подробное описание личности и проявления Лени пока не добавлено.",

        universe: "Описание вселенной пока не добавлено.",

        paletteName: "ХОЛОДНЫЙ СИНИЙ",
        paletteColor: "#7399B8",

        theme: {
            background: "#11151A",
            panel: "#1A222B",
            panelLight: "#253341",
            border: "#3D5264",
            text: "#E0E8F0",
            muted: "#9BAEBE",
            accent: "#83A9C8",
            glow: "rgba(115, 153, 184, 0.15)",
            surface: "#141B22",
            fieldBg: "#1C2731",
            portraitStart: "#30465A",
            portraitEnd: "#11151A"
        }
    },

    {
        id: "006",
        name: "Лалиет Веренс",
        alias: "Коллектор",
        sin: "Жадность",

        image: "",
        appearance: "Описание пока не добавлено.",

        personality: "Подробное описание личности и проявления Жадности пока не добавлено.",

        universe: "Описание вселенной пока не добавлено.",

        paletteName: "АНТИЧНОЕ ЗОЛОТО",
        paletteColor: "#D19A50",

        theme: {
            background: "#17130F",
            panel: "#272017",
            panelLight: "#3A2C1D",
            border: "#6D5030",
            text: "#F0E5D3",
            muted: "#BCA486",
            accent: "#D19A50",
            glow: "rgba(209, 154, 80, 0.16)",
            surface: "#1D1812",
            fieldBg: "#2A2118",
            portraitStart: "#4A3521",
            portraitEnd: "#17130F"
        }
    },

    {
        id: "007",
        name: "Кайден Роуэн",
        alias: "Холлоубайт",
        sin: "Чревоугодие",

        image: "",
        appearance: "Описание пока не добавлено.",

        personality: "Чревоугодие выражено через ненасытную жажду ощущений и адреналина. Подробное описание личности пока не добавлено.",

        universe: "Описание вселенной пока не добавлено.",

        paletteName: "ЖЖЁНЫЙ ОРАНЖЕВЫЙ",
        paletteColor: "#E36A35",

        theme: {
            background: "#17120F",
            panel: "#291C18",
            panelLight: "#40271E",
            border: "#70412D",
            text: "#F2E3D9",
            muted: "#C1A092",
            accent: "#E36A35",
            glow: "rgba(227, 106, 53, 0.17)",
            surface: "#1F1612",
            fieldBg: "#2B1D17",
            portraitStart: "#57301F",
            portraitEnd: "#17120F"
        }
    }
];

// Локальный путь к изображению. Разрешены относительные пути и пути от корня сайта.
function safePortraitPath(value) {
    const path = String(value || "").trim();
    if (!path || path.includes("..") || path.includes("\\") || /^(?:[a-z]+:|\/\/)/i.test(path)) return "";
    if (!/^\/?[a-z0-9_./ -]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(path)) return "";
    return path;
}

function renderPortrait(character) {
    const path = safePortraitPath(character.image);
    if (!path) {
        fields.portrait.innerHTML = '<div class="portrait-placeholder"><span class="portrait-symbol">VII</span><span>NO IMAGE</span><span class="portrait-caption">PORTRAIT NOT AVAILABLE</span></div>';
        fields.portrait.classList.remove("has-image");
        return;
    }
    const image = document.createElement("img");
    image.className = "portrait-image";
    image.alt = `Портрет: ${character.name}`;
    image.loading = "lazy";
    image.src = path;
    image.addEventListener("error", () => {
        fields.portrait.innerHTML = '<div class="portrait-placeholder"><span class="portrait-symbol">VII</span><span>NO IMAGE</span><span class="portrait-caption">PORTRAIT NOT AVAILABLE</span></div>';
        fields.portrait.classList.remove("has-image");
    }, { once: true });
    fields.portrait.replaceChildren(image);
    fields.portrait.classList.add("has-image");
}

const fields = {
    id: document.getElementById("subject-number"),
    name: document.getElementById("name"),
    alias: document.getElementById("alias"),
    sin: document.getElementById("sin"),
    fullName: document.getElementById("full-name"),
    fullAlias: document.getElementById("full-alias"),
    appearance: document.getElementById("appearance"),
    personality: document.getElementById("personality"),
    universe: document.getElementById("universe"),
    recordCount: document.getElementById("record-count"),
    paletteName: document.getElementById("palette-name"),
    paletteHex: document.getElementById("palette-hex"),
    paletteSwatch: document.getElementById("palette-swatch"),
    portrait: document.getElementById("portrait")
};

const buttons = [...document.querySelectorAll(".character")];
const dossier = document.querySelector(".dossier");
const root = document.documentElement;

let animationTimer = null;
let currentIndex = -1;

// Применяет цветовую тему выбранного персонажа.
function applyTheme(theme) {
    const variables = {
        "--background": theme.background,
        "--panel": theme.panel,
        "--panel-light": theme.panelLight,
        "--border": theme.border,
        "--text": theme.text,
        "--muted": theme.muted,
        "--accent": theme.accent,
        "--glow": theme.glow,
        "--surface": theme.surface,
        "--field-bg": theme.fieldBg,
        "--portrait-start": theme.portraitStart,
        "--portrait-end": theme.portraitEnd
    };

    Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// Обновляет карточку и данные выбранного персонажа.
function showCharacter(index) {
    const character = characters[index];

    if (!character) return;

    clearTimeout(animationTimer);
    currentIndex = index;

    // Переключение цветовой темы одновременно с анимацией досье
    applyTheme(character.theme);

    // Обновление выбранной кнопки
    buttons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    // Плавное сокрытие старого содержимого
    dossier.classList.add("switching");

    animationTimer = setTimeout(() => {
        // Проверка того факта, что за время анимации не выбрали другого персонажа
        if (currentIndex !== index) return;

        fields.id.textContent = `SUBJECT №${character.id}`;
        fields.name.textContent = character.name;
        fields.alias.textContent = `«${character.alias}»`;
        fields.sin.textContent = character.sin;
        fields.fullName.textContent = character.name;
        fields.fullAlias.textContent = character.alias;
        fields.appearance.textContent = character.appearance;
        fields.personality.textContent = character.personality;
        fields.universe.textContent = character.universe;
        renderPortrait(character);

        fields.recordCount.textContent =
            `КОЛЛЕКЦИЯ ПЕРСОНАЖЕЙ · 0${Number(character.id)} / ${String(characters.length).padStart(2, "0")}`;

        fields.paletteName.textContent = character.paletteName;
        fields.paletteHex.textContent = character.paletteColor;
        fields.paletteSwatch.style.backgroundColor = character.paletteColor;
        fields.paletteSwatch.setAttribute(
            "aria-label",
            `Цвет палитры ${character.paletteColor}`
        );

        dossier.classList.remove("switching");

        // Длинное досье начинается с заголовка
        document.querySelector(".details").scrollTop = 0;
    }, 180);
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const index = Number(button.dataset.id);
        showCharacter(index);
    });
});

// Загрузка первого персонажа при открытии архива
showCharacter(0);