


import React, { CSSProperties } from 'react';
import { DndAttribute, MadnessEffect, Trait, StartingItem, Skill, Feat, Race, ApertureGradeInfo, CharacterRankInfoNew, EssenceStageId, EssenceStageDetail, ArmorTypeForSleep, EquipmentSlotId } from './types'; // Updated CharacterRankInfoNew

export const DND_ATTRIBUTES_KEYS: DndAttribute[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'
];

export const DND_ATTRIBUTE_NAMES_RU: { [key in DndAttribute]: string } = {
  strength: 'Сила',
  dexterity: 'Ловкость',
  constitution: 'Телосложение',
  intelligence: 'Интеллект',
  wisdom: 'Мудрость',
  charisma: 'Харизма'
};

export const SAVING_THROW_KEYS: DndAttribute[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'
];

export const SAVING_THROW_NAMES_RU: { [key in DndAttribute]: string } = {
  strength: 'Спасбросок Силы',
  dexterity: 'Спасбросок Ловкости',
  constitution: 'Спасбросок Телосложения',
  intelligence: 'Спасбросок Интеллекта',
  wisdom: 'Спасбросок Мудрости',
  charisma: 'Спасбросок Харизмы'
};


export const ATTRIBUTE_BASE_SCORE = 8;
export const ATTRIBUTE_MIN_SCORE = 7; 
export const ATTRIBUTE_MAX_BUY_SCORE = 15; 
export const INITIAL_ATTRIBUTE_BUY_POINTS = 27; 

export const ATTRIBUTE_POINT_BUY_COST: { [score: number]: number } = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

export const INITIAL_MODIFICATION_POINTS = 0;
export const MAX_SKILL_PROFICIENCIES = 3; 
export const BASE_ARMOR_CLASS = 10;
export const DEFAULT_HIT_DIE_TYPE = 8; // d8 (Human default)

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const calculateProficiencyBonus = (level: number): number => {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2; // Default for levels 1-4
};


export const AVAILABLE_RACES: Race[] = [
  {
    id: "human",
    name: "Человек",
    description: "Стандартная и наиболее многочисленная раса в Мире Гу. Обладают сбалансированными способностями и наибольшим потенциалом к совершенствованию через систему Гу. Их тела являются эталоном для многих техник.",
    attributeModifiers: {},
    specialAbilities: ["Наибольший потенциал к совершенствованию Гу", "Наиболее приспособлены к разнообразным средам", "Средняя продолжительность жизни и характеристики"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "hairy_man",
    name: "Волосатый Человек",
    description: "От природы мастера обработки Гу, всё их существование вращается вокруг этого искусства. Покрыты густой шерстью, цвет которой зависит от специализации. Миролюбивы, обычно живут в благословенных землях или грот-небесах. Их общество строится на кастах мастеров обработки. Самовлюблённы и могут быть менее внимательны к окружению из-за концентрации на себе и своем искусстве.",
    attributeModifiers: { wisdom: -3 }, 
    specialAbilities: ["Врождённый талант к обработке Гу", "Создание уникальных рецептов Гу", "Физическая сила выше средней", "Покрыты густой защитной шерстью"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "eggman",
    name: "Яйцелюд",
    description: "Это крошечные человечки размером с младенца, они были розовыми и нежными, чрезвычайно милыми. Хрупкие существа с очень короткой продолжительностью жизни (несколько лет). Появляются из яиц, оставшихся после гибели незапамятных пустынных зверей. После смерти их душа и апертура превращаются в новое яйцо, продолжая цикл. Ценят каждый момент своей короткой жизни, обладают удивительной притягательностью.",
    attributeModifiers: { constitution: -1, charisma: 4 }, 
    specialAbilities: ["Уникальный цикл перерождения (душа и апертура становятся новым яйцом)", "Очень короткая продолжительность жизни", "Хрупкое телосложение"],
    hitDieInfoText: "Тип Костей Хитов: d6"
  },
  {
    id: "rockman",
    name: "Каменный Человек",
    description: "Живут под землей, питаясь почвой и минералами. Обладают чрезвычайно прочными телами, но медлительны. Долгожители, сдержанны в эмоциях. Их тела могут содержать ценные руды, а кожа тверда как камень.",
    attributeModifiers: { dexterity: -5 }, 
    skillModifiers: { skill_acrobatics: -2},
    specialAbilities: ["Сверхпрочное тело, высокая естественная защита", "Долголетие", "Способность потреблять минералы для питания и силы", "Медлительность"],
    hitDieInfoText: "Тип Костей Хитов: d12"
  },
  {
    id: "featherman",
    name: "Пернатый Человек",
    description: "Обладают парой крыльев, позволяющих им искусно летать. Их тела легкие и изящные. Ценят свободу превыше всего и обычно обитают в высоких горах или летающих структурах. Гордая и независимая раса, но их красота и способность к полету делают их желанной целью для работорговцев.",
    attributeModifiers: { constitution: -1}, 
    specialAbilities: ["Врождённая способность к полёту", "Повышенная ловкость в воздухе", "Легкое телосложение", "Острое зрение"],
    textualEffects: ["Особое: Полёт, Повышенный риск стать целью работорговцев"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "inkman",
    name: "Чернильный Человек",
    description: "Их тела состоят из чернил, способных формировать \"Чернильные Слова\" с глубоким смыслом и эффектами. Обитают в местах с богатой литературной аурой, таких как Город Чернильщиков. Умеют создавать Чернильные Гу и ценят знания. Их чернильная природа делает их уязвимыми к большому количеству воды.",
    attributeModifiers: {}, 
    specialAbilities: ["Создание Чернильных Слов с магическими эффектами", "Способность к левитации (парению)", "Связь с литературной и информационной силой"],
    textualEffects: ["Особое: Левитация; Уязвимость: Вода"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "snowman",
    name: "Снежный Человек",
    description: "Живут в экстремально холодных, ледяных условиях. Их тела состоят из льда и снега, что делает их уязвимыми к теплу и огню. Способны манипулировать льдом и снегом, создавать ледяных Гу. Обычно спокойны, но могут быть яростными защитниками своей территории.",
    attributeModifiers: {}, 
    specialAbilities: ["Манипуляция льдом и снегом", "Иммунитет к холоду", "Слияние со снежной средой"],
    textualEffects: ["Особое: Преимущество при какой либо манипуляции со льдом или снегом; Уязвимость: Тепло и Огонь"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "miniman",
    name: "Миничеловек",
    description: "Чрезвычайно маленького роста, обычно не выше пальца взрослого человека. Обитают в лесах, среди гигантских растений или внутри благословенных земель. Славятся виноделием, садоводством и созданием миниатюрных Гу. Их размер делает их хрупкими и не очень сильными, но проворными.",
    attributeModifiers: { constitution: -2, strength: -2, dexterity: 3 }, 
    specialAbilities: ["Крошечный размер (преимущество в скрытности, уязвимость в бою)", "Эксперты в виноделии и садоводстве", "Способность жить в гармонии с природой", "Создание миниатюрных Гу червей"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "merman",
    name: "Мерфолк", 
    description: "Водные гуманоиды, способные дышать под водой и искусно плавать. Верхняя часть тела человеческая, нижняя – рыбий хвост. Живут в морях, озерах и реках. Известны своим пением, контролем над водными течениями и торговлей подводными ресурсами. На суше они неуклюжи.",
    attributeModifiers: {}, 
    specialAbilities: ["Подводное дыхание и скоростное плавание", "Контроль водных потоков (врождённый)", "Целебные свойства слез (у некоторых индивидов)", "Красивый голос с возможными эффектами"],
    textualEffects: ["Особое: Уязвимость на суше (Ловкость -3 на суше)"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "beastman",
    name: "Зверочеловек",
    description: "Гибриды людей и зверей, сочетающие черты обоих. Могут иметь уши, хвосты, мех или когти различных животных. Часто обладают повышенной силой, ловкостью или обостренными чувствами, соответствующими их звериной части. Их животная природа может отталкивать более 'цивилизованные' расы.",
    attributeModifiers: { charisma: -2 },
    skillModifiers: { skill_athletics: 1, skill_acrobatics: 1, skill_animal_handling: 1 },
    specialAbilities: ["Усиленные физические характеристики (сила/ловкость/выносливость)", "Обострённые чувства (слух, обоняние, ночное зрение)", "Природное оружие (когти, клыки)", "Связь с животным началом"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  },
  {
    id: "mushroomman",
    name: "Грибочеловек",
    description: "Их тела напоминают грибы, с шляпкой на голове. Живут в тёмных, влажных местах. Способны выпускать споры. Обладают коллективным сознанием в больших группах. Из-за своей природы и миролюбия им трудно проявлять агрессию или запугивать.",
    attributeModifiers: {},
    skillModifiers: { skill_nature: 2, skill_intimidation: -3 },
    specialAbilities: ["Высвобождение спор с различными эффектами", "Коллективное сознание (в группах)", "Регенерация в подходящей (влажной, темной) среде", "Симбиотические отношения с грибами"],
    hitDieInfoText: "Тип Костей Хитов: d8"
  }
];


export const AVAILABLE_TRAITS: Trait[] = [
  // Преимущества (Положительная стоимость)
  { id: "trait_tough", name: "Крепкий", description: "Максимум ваших пунктов здоровья увеличивается на 2.", modificationPointCost: 2 },
  { id: "trait_resilient_con", name: "Стойкий (Телосложение)", description: "+1 к Телосложению.", modificationPointCost: 2 }, // Implies CON save proficiency in D&D
  { id: "trait_observant", name: "Наблюдательный", description: "+1 к Мудрости или Интеллекту, умение читать по губам, +5 к пассивной Внимательности/Расследованию.", modificationPointCost: 3 },
  { id: "trait_alert", name: "Бдительный", description: "Вы получаете +2 к инициативе и не можете быть застигнуты врасплох, пока в сознании.", modificationPointCost: 3 },
  { id: "trait_linguist", name: "Лингвист", description: "+1 к Интеллекту. Вы изучаете три языка на ваш выбор.", modificationPointCost: 2 },
  { id: "trait_lucky", name: "Везучий", description: "У вас есть 3 очка удачи. Вы можете потратить одно очко удачи, чтобы перебросить бросок атаки, проверку характеристики или спасбросок. Восстанавливается при долгом отдыхе.", modificationPointCost: 4 },
];

export const AVAILABLE_STARTING_ITEMS: StartingItem[] = [
  // --- Basic Gear ---
  { id: "item_dagger", name: "Простой кинжал", description: "Обычный, несколько поношенный кинжал. Колющее оружие.", modificationPointCost: 1, compatibleSlots: ['mainHand', 'offHand', 'leg_weapon_L', 'leg_weapon_R'] },
  { id: "item_rations", name: "Сухой паек (1 день)", description: "Достаточно еды на один день.", modificationPointCost: 1, compatibleSlots: ['leg_pouch_L', 'leg_pouch_R'] },
  { id: "item_waterskin", name: "Бутыль с водой", description: "Полная бутыль с водой.", modificationPointCost: 1, compatibleSlots: ['leg_pouch_L', 'leg_pouch_R'] },
  { id: "item_torch", name: "Факел", description: "Один незажженный факел. Можно держать в руке для освещения.", modificationPointCost: 0, compatibleSlots: ['offHand'] },
  { id: "item_tinderbox", name: "Трутница", description: "Используется для разведения огня.", modificationPointCost: 1, compatibleSlots: ['leg_pouch_L', 'leg_pouch_R'] },
  { id: "item_rope", name: "Веревка (50 футов)", description: "Моток пеньковой веревки.", modificationPointCost: 1, compatibleSlots: [] },
  { id: "item_backpack", name: "Простой рюкзак", description: "Может вместить несколько мелких предметов. Сам по себе не экипируется.", modificationPointCost: 1, compatibleSlots: [] },
  { id: "item_bedroll", name: "Спальный мешок", description: "Для относительно комфортного отдыха.", modificationPointCost: 1, compatibleSlots: [] },
  { id: "item_crowbar", name: "Лом", description: "Полезен для взламывания. Можно использовать как импровизированную дубину.", modificationPointCost: 2, compatibleSlots: ['mainHand'] },
  { id: "item_pouch_coins", name: "Мешочек с 10 золотыми монетами", description: "Немного валюты из вашего старого мира, здесь может быть бесполезна.", modificationPointCost: 1, compatibleSlots: ['leg_pouch_L', 'leg_pouch_R'] },
  
  // --- Equippable Items ---
  { id: "item_simple_shirt", name: "Простая рубаха", description: "Обычная рубаха из грубой ткани.", modificationPointCost: 1, compatibleSlots: ['underwear'] },
  { id: "item_leather_armor", name: "Кожаная броня", description: "Простая броня из дубленой кожи. Дает +1 к КБ.", modificationPointCost: 3, compatibleSlots: ['armor'] },
  { id: "item_simple_helmet", name: "Простой шлем", description: "Базовая защита для головы.", modificationPointCost: 1, compatibleSlots: ['head'] },
  { id: "item_sturdy_boots", name: "Крепкие сапоги", description: "Защищают ноги от острых камней и пересеченной местности.", modificationPointCost: 1, compatibleSlots: ['feet'] },
  { id: "item_cloth_trousers", name: "Тканевые штаны", description: "Простые, но прочные штаны.", modificationPointCost: 1, compatibleSlots: ['legs'] },
  { id: "item_leather_gloves", name: "Кожаные перчатки", description: "Защищают руки и улучшают хват.", modificationPointCost: 1, compatibleSlots: ['hands_L', 'hands_R'] },
  { id: "item_wool_cloak", name: "Шерстяной плащ", description: "Плащ, который защищает от непогоды.", modificationPointCost: 2, compatibleSlots: ['shoulder_L'] },
  { id: "item_simple_bag", name: "Простая сумка", description: "Небольшая сумка через плечо для мелочей.", modificationPointCost: 1, compatibleSlots: ['shoulder_L', 'shoulder_R'] },
  { id: "item_short_sword", name: "Короткий меч", description: "Надежный короткий меч. Режущее оружие.", modificationPointCost: 3, compatibleSlots: ['mainHand', 'offHand', 'leg_weapon_L', 'leg_weapon_R'] },
  { id: "item_wooden_ring", name: "Деревянное кольцо", description: "Простое кольцо из дерева. Возможно, имеет сентиментальную ценность.", modificationPointCost: 0, compatibleSlots: ['ring_L1', 'ring_L2', 'ring_L3', 'ring_R1', 'ring_R2', 'ring_R3'] },
  { id: "item_leather_bracelet", name: "Кожаный браслет", description: "Простой браслет из кожи.", modificationPointCost: 0, compatibleSlots: ['bracelet_L', 'bracelet_R'] },
  { id: "item_string_amulet", name: "Амулет на веревке", description: "Простой камень, висящий на веревке.", modificationPointCost: 0, compatibleSlots: ['amulet', 'amulet2'] },
];



export const AVAILABLE_MADNESS_EFFECTS: MadnessEffect[] = [
  { id: "mad_short_1", name: "Вынужденное действие", description: "Персонаж парализован от страха или неудержимо хихикает в течение 1 минуты.", type: "short-term", modificationPointAdjustment: -1 },
  { id: "mad_short_2", name: "Сенсорная перегрузка", description: "Персонаж испытывает яркие галлюцинации в течение 1 минуты.", type: "short-term", modificationPointAdjustment: -1 },
  { id: "mad_long_1", name: "Фобия", description: "У персонажа развивается иррациональный страх перед чем-то конкретным.", type: "long-term", modificationPointAdjustment: -2 },
  { id: "mad_long_2", name: "Амнезия", description: "Персонаж забывает что-то важное или страдает амнезией относительно определенного периода времени.", type: "long-term", modificationPointAdjustment: -2 },
  { id: "mad_indef_1", name: "Бред", description: "Персонаж верит во что-то, что очевидно ложно.", type: "indefinite", modificationPointAdjustment: -3 },
];

export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17";

export const AVAILABLE_SKILLS: Skill[] = [
    { id: "skill_athletics", name: "Атлетика", description: "Лазание, прыжки, плавание и силовые подвиги.", relatedAttribute: "strength" },
    { id: "skill_acrobatics", name: "Акробатика", description: "Баланс, ловкость и воздушные маневры.", relatedAttribute: "dexterity" },
    { id: "skill_sleight_of_hand", name: "Ловкость рук", description: "Ручная сноровка для таких задач, как карманные кражи или сложная работа.", relatedAttribute: "dexterity" },
    { id: "skill_stealth", name: "Скрытность", description: "Передвижение незамеченным и неслышным, а также эффективное укрытие.", relatedAttribute: "dexterity" },
    { id: "skill_history", name: "История", description: "Знание прошлых событий, цивилизаций и исторических личностей.", relatedAttribute: "intelligence" },
    { id: "skill_arcana", name: "Магия", description: "Знание магии, магических традиций и планов существования.", relatedAttribute: "intelligence" },
    { id: "skill_nature", name: "Природа", description: "Знание флоры, фауны, погоды и природного ландшафта.", relatedAttribute: "intelligence" },
    { id: "skill_investigation", name: "Расследование", description: "Дедукция информации, поиск улик и решение головоломок.", relatedAttribute: "intelligence" },
    { id: "skill_religion", name: "Религия", description: "Знание божеств, религиозных обрядов и теологии.", relatedAttribute: "intelligence" },
    { id: "skill_perception", name: "Восприятие", description: "Замечание деталей, обнаружение скрытых вещей и общая осведомленность.", relatedAttribute: "wisdom" },
    { id: "skill_survival", name: "Выживание", description: "Выслеживание, поиск пищи, навигация в дикой местности и выживание в суровых условиях.", relatedAttribute: "wisdom" },
    { id: "skill_medicine", name: "Медицина", description: "Стабилизация умирающих, диагностика болезней и оказание медицинской помощи.", relatedAttribute: "wisdom" },
    { id: "skill_insight", name: "Проницательность", description: "Распознавание истинных намерений и предсказание поведения.", relatedAttribute: "wisdom" },
    { id: "skill_animal_handling", name: "Уход за животными", description: "Успокоение, понимание и управление животными.", relatedAttribute: "wisdom" },
    { id: "skill_performance", name: "Выступление", description: "Развлечение других с помощью музыки, актерской игры, рассказывания историй и т.д.", relatedAttribute: "charisma" },
    { id: "skill_intimidation", name: "Запугивание", description: "Влияние на других через угрозы и принуждение.", relatedAttribute: "charisma" },
    { id: "skill_deception", name: "Обман", description: "Ложь, введение в заблуждение и сокрытие правды.", relatedAttribute: "charisma" },
    { id: "skill_persuasion", name: "Убеждение", description: "Убеждение других с помощью рассуждений, обаяния или социальной грации.", relatedAttribute: "charisma" },
];

export const AVAILABLE_FEATS: Feat[] = [
    { id: "feat_grappler", name: "Борец", description: "Преимущество на броски атаки против схваченного вами существа. Вы можете использовать свое действие, чтобы попытаться прижать схваченное вами существо.", requirements: [{ attribute: "strength", minValue: 13 }] },
    { id: "feat_sharpshooter", name: "Меткий стрелок", description: "Атака на дальней дистанции не накладывает помеху. Ваши атаки дальнобойным оружием игнорируют укрытие на половину и три четверти. Прежде чем совершить атаку дальнобойным оружием, которым вы владеете, вы можете выбрать штраф -2 к броску атаки. Если атака попадает, вы добавляете +4 к урону атаки.", requirements: [{ attribute: "dexterity", minValue: 14 }] },
    { id: "feat_mage_slayer", name: "Убийца магов", description: "Когда существо в пределах 5 футов от вас применяет заклинание, вы можете использовать свою реакцию, чтобы совершить рукопашную атаку оружием против этого существа. Когда вы наносите урон существу, которое концентрируется на заклинании, это существо получает помеху на спасбросок для поддержания концентрации. У вас есть преимущество на спасброски от заклинаний, применяемых существами в пределах 5 футов от вас.", requirements: [{ attribute: "intelligence", minValue: 13 }, {attribute: "dexterity", minValue: 13}] },
    { id: "feat_inspiring_leader", name: "Вдохновляющий лидер", description: "Вы можете потратить 10 минут, вдохновляя своих спутников, укрепляя их решимость сражаться. Выберите до шести дружественных существ (включая себя) в пределах 30 футов от вас, которые могут видеть или слышать вас и понимать вас. Каждое существо получает временные пункты здоровья, равные вашему модификатору Харизмы + уровень персонажа. Существо не может снова получить временные пункты здоровья от этой черты, пока не закончит короткий или долгий отдых.", requirements: [{ attribute: "charisma", minValue: 14 }] },
    { id: "feat_durable", name: "Выносливый", description: "Ваше Телосложение увеличивается на 1, максимум до 20. Когда вы бросаете Кость Здоровья для восстановления пунктов здоровья, минимальное количество пунктов здоровья, которое вы восстанавливаете от броска, равно удвоенному вашему модификатору Телосложения (минимум 2).", requirements: [{ attribute: "constitution", minValue: 13 }] },
    { id: "feat_keen_mind", name: "Острый ум", description: "Ваш Интеллект увеличивается на 1, максимум до 20. Вы всегда знаете, где север. Вы всегда знаете, сколько часов осталось до следующего восхода или заката. Вы можете точно вспомнить все, что видели или слышали за последний месяц.", requirements: [{ attribute: "intelligence", minValue: 14}]},
    { id: "feat_mobile", name: "Подвижный", description: "Ваша скорость увеличивается на 10 футов. Когда вы используете действие Рывок, труднопроходимая местность не требует от вас дополнительного движения в этот ход. Когда вы совершаете рукопашную атаку против существа, вы не провоцируете атаки по возможности от этого существа до конца хода, независимо от того, попали вы или нет.", requirements: [{attribute: "dexterity", minValue: 13}]},
    { id: "feat_savage_attacker", name: "Свирепый атакующий", description: "Один раз в ход, когда вы бросаете урон для рукопашной атаки оружием, вы можете перебросить кости урона оружия и использовать любой результат.", requirements: [{attribute: "strength", minValue: 13}]},
    { id: "feat_tough_upgrade", name: "Закаленный", description: "Ваш максимум пунктов здоровья увеличивается на величину, равную удвоенному вашему уровню, когда вы получаете эту черту. Всякий раз, когда вы получаете уровень после этого, ваш максимум пунктов здоровья увеличивается еще на 2 пункта.", requirements: [{attribute: "constitution", minValue: 15}]},
    { 
      id: "feat_flaw_feeble", 
      name: "Хилое Тело (Авто-Изъян)", 
      description: "Вы получаете помеху на спасброски Телосложения против болезней и ядов. Этот изъян активируется автоматически при низком Телосложении и не дает ОМ.", 
      requirements: [{ attribute: "constitution", maxValue: 9 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_slow_learner", 
      name: "Медленное Обучение (Авто-Изъян)", 
      description: "Получение новых комплексных знаний или навыков занимает у вас вдвое больше времени. Этот изъян активируется автоматически при низком Интеллекте и не дает ОМ.", 
      requirements: [{ attribute: "intelligence", maxValue: 9 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_inattentive", 
      name: "Невнимательный (Авто-Изъян)", 
      description: "Помеха на проверки Мудрости (Восприятие), связанные с замечанием деталей или скрытых объектов. Этот изъян активируется автоматически при низкой Мудрости и не дает ОМ.", 
      requirements: [{ attribute: "wisdom", maxValue: 8 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_weak_willed", 
      name: "Слабая Воля (Авто-Изъян)", 
      description: "Помеха на спасброски Мудрости против эффектов, влияющих на разум (например, очарование, страх). Этот изъян активируется автоматически при низкой Мудрости и не дает ОМ.", 
      requirements: [{ attribute: "wisdom", maxValue: 9 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_socially_awkward", 
      name: "Неловкий в Обществе (Авто-Изъян)", 
      description: "Помеха на проверки Харизмы (Убеждение) и Харизмы (Обман) при взаимодействии с незнакомцами. Этот изъян активируется автоматически при низкой Харизме и не дает ОМ.", 
      requirements: [{ attribute: "charisma", maxValue: 8 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_forgetful", 
      name: "Забывчивый (Авто-Изъян)", 
      description: "Трудности с запоминанием имен, недавних событий или инструкций. Помеха на проверки Интеллекта (История) касательно недавних событий. Этот изъян активируется автоматически при низком Интеллекте и не дает ОМ.", 
      requirements: [{ attribute: "intelligence", maxValue: 8 }], 
      modificationPointAdjustment: 0, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_cowardly_manual", 
      name: "Трусливый (Изъян)", 
      description: "Вы получаете помеху на спасброски против состояния 'Испуган'. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 1, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_superstitious_manual", 
      name: "Суеверный (Изъян)", 
      description: "Вы слепо верите в приметы и предзнаменования, что может приводить к нерациональным решениям. Помеха на спасброски Мудрости против обмана, связанного с суевериями. Можно выбрать для получения ОМ.", 
      requirements: [],
      modificationPointAdjustment: 1, 
      isFlaw: true 
    },
    {
      id: "feat_flaw_memorable_face_manual", 
      name: "Запоминающееся Лицо (Изъян)",
      description: "Вас очень легко запомнить и опознать, даже если вы пытаетесь оставаться незамеченным. Помеха на проверки Харизмы (Обман) при попытке выдать себя за другого. Можно выбрать для получения ОМ.",
      requirements: [],
      modificationPointAdjustment: 1,
      isFlaw: true
    },
    { 
      id: "feat_flaw_frail_trait_migrated", 
      name: "Хилый (Изъян)", 
      description: "-1 к Телосложению. Ваше тело слабее обычного. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 2, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_anxious_trait_migrated", 
      name: "Тревожный (Изъян)", 
      description: "У вас помеха на проверки Харизмы (Выступление). Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 1, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_bad_eyesight_trait_migrated", 
      name: "Плохое Зрение (Изъян)", 
      description: "Помеха на проверки Мудрости (Внимательность), зависящие от зрения на расстоянии более 10 футов. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 2, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_clumsy_trait_migrated", 
      name: "Неуклюжий (Изъян)", 
      description: "-1 к Ловкости. Вы часто спотыкаетесь или роняете вещи. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 2, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_loud_trait_migrated", 
      name: "Болтун (Изъян)", 
      description: "Помеха на проверки Ловкости (Скрытность). Вам трудно сохранять тишину. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 1, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_unlucky_trait_migrated", 
      name: "Невезучий (Изъян)", 
      description: "Один раз за долгий отдых Мастер может потребовать от вас перебросить успешный бросок d20 и использовать новый результат. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 3, 
      isFlaw: true 
    },
    { 
      id: "feat_flaw_haunted_trait_migrated", 
      name: "Преследуемый (Изъян)", 
      description: "За вами следует незначительный, в основном безвредный дух, который иногда отвлекает или вызывает мелкие неудобства. Можно выбрать для получения ОМ.", 
      requirements: [], 
      modificationPointAdjustment: 1, 
      isFlaw: true 
    }
];

// Aperture and Rank Constants
export const APERTURE_GRADES: ApertureGradeInfo[] = [
  { id: 'D', name: "D Grade (20-39%)", minMaxEssence: 20, maxMaxEssence: 39, recoveryTimeHours: 24, description: "Низкий талант, очень медленное восстановление эссенции." },
  { id: 'C', name: "C Grade (40-59%)", minMaxEssence: 40, maxMaxEssence: 59, recoveryTimeHours: 12, description: "Средний талант, медленное восстановление эссенции." },
  { id: 'B', name: "B Grade (60-79%)", minMaxEssence: 60, maxMaxEssence: 79, recoveryTimeHours: 6, description: "Высокий талант, быстрое восстановление эссенции." },
  { id: 'A', name: "A Grade (80-99%)", minMaxEssence: 80, maxMaxEssence: 99, recoveryTimeHours: 3, description: "Высший талант, очень быстрое восстановление эссенции." },
  { id: 'S', name: "S Grade / 10 Экстрем. Телосложений (100%)", minMaxEssence: 100, maxMaxEssence: 100, recoveryTimeHours: 1, description: "Исключительный талант (например, Десять Экстремальных Телосложений), молниеносное восстановление эссенции." }
];

export const ESSENCE_STAGES: { id: EssenceStageId, displayName: string }[] = [
  { id: 'Initial', displayName: 'Начальная стадия' },
  { id: 'Middle', displayName: 'Средняя стадия' },
  { id: 'Upper', displayName: 'Верхняя стадия' },
  { id: 'Peak', displayName: 'Пиковая стадия' },
];

export const CHARACTER_RANKS: CharacterRankInfoNew[] = [
  {
    id: 'R1', numericRank: 1, name: "Ранг 1 Мастер Гу", rankColorGroup: "Зеленая Медь", condensation: "Жидкая",
    stages: [
      { id: 'Initial', name: "Начальная стадия", stageSpecificEssenceName: "Нефритово-Зеленая Первобытная Эссенция", color: "rgba(0, 168, 107, 0.75)", colorName: "Нефритово-Зеленый" },
      { id: 'Middle', name: "Средняя стадия", stageSpecificEssenceName: "Бледно-Зеленая Первобытная Эссенция", color: "rgba(152, 251, 152, 0.75)", colorName: "Бледно-Зеленый" },
      { id: 'Upper', name: "Верхняя стадия", stageSpecificEssenceName: "Темно-Зеленая Первобытная Эссенция", color: "rgba(0, 100, 0, 0.75)", colorName: "Темно-Зеленый" },
      { id: 'Peak', name: "Пиковая стадия", stageSpecificEssenceName: "Черно-Зеленая Первобытная Эссенция", color: "rgba(0, 51, 0, 0.85)", colorName: "Черно-Зеленый" }
    ]
  },
  {
    id: 'R2', numericRank: 2, name: "Ранг 2 Мастер Гу", rankColorGroup: "Красная Сталь", condensation: "Жидкая",
    stages: [
      { id: 'Initial', name: "Начальная стадия", stageSpecificEssenceName: "Светло-Красная Первобытная Эссенция", color: "rgba(255, 127, 127, 0.75)", colorName: "Светло-Красный" },
      { id: 'Middle', name: "Средняя стадия", stageSpecificEssenceName: "Ало-Красная Первобытная Эссенция", color: "rgba(255, 36, 0, 0.75)", colorName: "Ало-Красный" },
      { id: 'Upper', name: "Верхняя стадия", stageSpecificEssenceName: "Малиново-Красная Первобытная Эссенция", color: "rgba(220, 20, 60, 0.75)", colorName: "Малиново-Красный" },
      { id: 'Peak', name: "Пиковая стадия", stageSpecificEssenceName: "Темно-Красная Первобытная Эссенция", color: "rgba(139, 0, 0, 0.85)", colorName: "Темно-Красный" }
    ]
  },
  {
    id: 'R3', numericRank: 3, name: "Ранг 3 Мастер Гу", rankColorGroup: "Белое Серебро", condensation: "Жидкая",
    stages: [
      { id: 'Initial', name: "Начальная стадия", stageSpecificEssenceName: "Светло-Серебряная Первобытная Эссенция", color: "rgba(211, 211, 211, 0.85)", colorName: "Светло-Серебряный" },
      { id: 'Middle', name: "Средняя стадия", stageSpecificEssenceName: "Цветочно-Серебряная Первобытная Эссенция", color: "rgba(220, 220, 220, 0.85)", colorName: "Цветочно-Серебряный" },
      { id: 'Upper', name: "Верхняя стадия", stageSpecificEssenceName: "Ярко-Серебряная Первобытная Эссенция", color: "rgba(192, 192, 192, 0.85)", colorName: "Ярко-Серебряный" },
      { id: 'Peak', name: "Пиковая стадия", stageSpecificEssenceName: "Снежно-Серебряная Первобытная Эссенция", color: "rgba(230, 230, 240, 0.90)", colorName: "Снежно-Серебряный" }
    ]
  },
  {
    id: 'R4', numericRank: 4, name: "Ранг 4 Мастер Гу", rankColorGroup: "Желтое Золото", condensation: "Жидкая",
    stages: [
      { id: 'Initial', name: "Начальная стадия", stageSpecificEssenceName: "Светло-Золотая Первобытная Эссенция", color: "rgba(255, 236, 139, 0.75)", colorName: "Светло-Золотой" },
      { id: 'Middle', name: "Средняя стадия", stageSpecificEssenceName: "Ярко-Золотая Первобытная Эссенция", color: "rgba(255, 215, 0, 0.75)", colorName: "Ярко-Золотой" },
      { id: 'Upper', name: "Верхняя стадия", stageSpecificEssenceName: "Сущностно-Золотая Первобытная Эссенция", color: "rgba(255, 190, 0, 0.75)", colorName: "Сущностно-Золотой" },
      { id: 'Peak', name: "Пиковая стадия", stageSpecificEssenceName: "Истинно-Золотая Первобытная Эссенция", color: "rgba(218, 165, 32, 0.85)", colorName: "Истинно-Золотой" }
    ]
  },
  {
    id: 'R5', numericRank: 5, name: "Ранг 5 Мастер Гу", rankColorGroup: "Фиолетовый Кристалл", condensation: "Полутвердый кристалл",
    stages: [
      { id: 'Initial', name: "Начальная стадия", stageSpecificEssenceName: "Светло-Пурпурная Кристаллическая Эссенция", color: "rgba(221, 160, 221, 0.75)", colorName: "Светло-Пурпурный" },
      { id: 'Middle', name: "Средняя стадия", stageSpecificEssenceName: "Фиолетово-Пурпурная Кристаллическая Эссенция", color: "rgba(138, 43, 226, 0.75)", colorName: "Фиолетово-Пурпурный" },
      { id: 'Upper', name: "Верхняя стадия", stageSpecificEssenceName: "Глубоко-Пурпурная Кристаллическая Эссенция", color: "rgba(75, 0, 130, 0.75)", colorName: "Глубоко-Пурпурный" },
      { id: 'Peak', name: "Пиковая стадия", stageSpecificEssenceName: "Кристально-Пурпурная Эссенция", color: "rgba(153, 102, 204, 0.85)", colorName: "Кристально-Пурпурный" }
    ]
  }
];

export const ARMOR_TYPES_FOR_SLEEP: {id: ArmorTypeForSleep, name: string}[] = [
    {id: 'none', name: 'Без доспехов / Одежда'},
    {id: 'light', name: 'Легкие доспехи'},
    {id: 'medium', name: 'Средние доспехи'},
    {id: 'heavy', name: 'Тяжелые доспехи'},
];

export const getEssenceDetails = (rankId?: string, stageId?: EssenceStageId): EssenceStageDetail | undefined => {
  if (!rankId || !stageId) return undefined;
  const rank = CHARACTER_RANKS.find(r => r.id === rankId);
  return rank?.stages.find(s => s.id === stageId);
};

// --- Essence Condensation Logic ---
const SMALL_REALM_STAGE_FACTORS_VS_INITIAL: { [key in EssenceStageId]: number } = {
  Initial: 1,
  Middle: 4,  // 1 Middle = 4 Initial
  Upper: 16, // 1 Upper = 4 Middle = 16 Initial
  Peak: 64,   // 1 Peak = 4 Upper = 64 Initial
};

export const ESSENCE_VALUE_IN_R1_PEAK_UNITS: { [rankId: string]: { [stageId in EssenceStageId]?: number } } = {};

const populateEssenceValueTable = () => {
  const R1P_val = 1; 

  ESSENCE_VALUE_IN_R1_PEAK_UNITS['R1'] = {
    Initial: R1P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak), 
    Middle: R1P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Middle / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak),   
    Upper: R1P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Upper / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak),     
    Peak: R1P_val, 
  };

  const R2P_val = 1000 * R1P_val; 
  ESSENCE_VALUE_IN_R1_PEAK_UNITS['R2'] = {
    Initial: R2P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak), 
    Middle: R2P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Middle / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak),   
    Upper: R2P_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Upper / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak),    
    Peak: R2P_val, 
  };
  
  const R3I_val_direct = 10000 * R1P_val;
  ESSENCE_VALUE_IN_R1_PEAK_UNITS['R3'] = {
    Initial: R3I_val_direct, 
    Middle: R3I_val_direct * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Middle / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial), 
    Upper: R3I_val_direct * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Upper / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),   
    Peak: R3I_val_direct * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),    
  };

  const R4I_val = 10 * ESSENCE_VALUE_IN_R1_PEAK_UNITS['R3']['Peak']!;
  ESSENCE_VALUE_IN_R1_PEAK_UNITS['R4'] = {
    Initial: R4I_val,
    Middle: R4I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Middle / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
    Upper: R4I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Upper / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
    Peak: R4I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
  };

  const R5I_val = 10 * ESSENCE_VALUE_IN_R1_PEAK_UNITS['R4']['Peak']!;
  ESSENCE_VALUE_IN_R1_PEAK_UNITS['R5'] = {
    Initial: R5I_val,
    Middle: R5I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Middle / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
    Upper: R5I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Upper / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
    Peak: R5I_val * (SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Peak / SMALL_REALM_STAGE_FACTORS_VS_INITIAL.Initial),
  };
};
populateEssenceValueTable();


export interface CondensationDetailInfo {
  comparisonStageRankName: string;
  comparisonStageName: string;
  factor: number; 
  isMoreConcentrated: boolean; 
}

export const getEssenceCondensationDetails = (currentRankId: string, currentStageId: EssenceStageId): CondensationDetailInfo[] => {
  const details: CondensationDetailInfo[] = [];
  const currentRankInfo = CHARACTER_RANKS.find(r => r.id === currentRankId);
  if (!currentRankInfo) return details;

  const currentValueInR1P = ESSENCE_VALUE_IN_R1_PEAK_UNITS[currentRankId]?.[currentStageId];
  if (currentValueInR1P === undefined) return details;

  for (const stage of currentRankInfo.stages) {
    if (stage.id === currentStageId) continue;
    const otherValueInR1P = ESSENCE_VALUE_IN_R1_PEAK_UNITS[currentRankId]?.[stage.id];
    if (otherValueInR1P !== undefined && otherValueInR1P !== 0) {
      const factor = currentValueInR1P / otherValueInR1P;
      details.push({
        comparisonStageRankName: currentRankInfo.name,
        comparisonStageName: stage.name,
        factor: factor,
        isMoreConcentrated: factor > 1,
      });
    }
  }
  
  const keyComparisons = [
    { rankId: 'R1', stageId: 'Peak' as EssenceStageId, name: 'Пиковой стадии Ранга 1'},
    { rankId: 'R1', stageId: 'Initial' as EssenceStageId, name: 'Начальной стадии Ранга 1'},
  ];
  if (currentRankId !== 'R2') keyComparisons.push({ rankId: 'R2', stageId: 'Peak' as EssenceStageId, name: 'Пиковой стадии Ранга 2'});
  if (currentRankId !== 'R3') keyComparisons.push({ rankId: 'R3', stageId: 'Initial' as EssenceStageId, name: 'Начальной стадии Ранга 3'});


  for (const comp of keyComparisons) {
    if (comp.rankId === currentRankId && comp.stageId === currentStageId) continue;
    const compRankInfo = CHARACTER_RANKS.find(r => r.id === comp.rankId);
    if (!compRankInfo) continue;

    const otherValueInR1P = ESSENCE_VALUE_IN_R1_PEAK_UNITS[comp.rankId]?.[comp.stageId];
    if (otherValueInR1P !== undefined && otherValueInR1P !== 0) {
       const factor = currentValueInR1P / otherValueInR1P;
        details.push({
            comparisonStageRankName: "", 
            comparisonStageName: comp.name,
            factor: factor,
            isMoreConcentrated: factor > 1,
        });
    }
  }
  return details.sort((a,b) => b.factor - a.factor); 
};


// --- End Essence Condensation Logic ---

// --- Inventory Constants ---
export const EQUIPMENT_SLOT_IDS: EquipmentSlotId[] = [
  'head', 'amulet', 'amulet2', 'shoulder_L', 'shoulder_R', 'underwear', 'armor', 
  'mainHand', 'offHand', 
  'ring_L1', 'ring_L2', 'ring_L3',
  'ring_R1', 'ring_R2', 'ring_R3',
  'bracelet_L', 'bracelet_R',
  'hands_L', 'hands_R', 'legs', 'feet',
  'leg_weapon_L', 'leg_weapon_R',
  'leg_pouch_L', 'leg_pouch_R'
];

export const EQUIPMENT_SLOT_NAMES_RU: Record<EquipmentSlotId, string> = {
  head: 'Голова',
  armor: 'Броня',
  underwear: 'Одежда',
  legs: 'Штаны',
  feet: 'Ступни',
  hands_L: 'Перчатки Л',
  hands_R: 'Перчатки П',
  mainHand: 'Основная рука',
  offHand: 'Вторая рука',
  shoulder_L: 'Левое плечо',
  shoulder_R: 'Правое плечо',
  amulet: 'Амулет 1',
  amulet2: 'Амулет 2',
  ring_L1: 'Кольцо Л1',
  ring_L2: 'Кольцо Л2',
  ring_L3: 'Кольцо Л3',
  ring_R1: 'Кольцо П1',
  ring_R2: 'Кольцо П2',
  ring_R3: 'Кольцо П3',
  bracelet_L: 'Браслет Л',
  bracelet_R: 'Браслет П',
  leg_weapon_L: 'Оружие на ноге Л',
  leg_weapon_R: 'Оружие на ноге П',
  leg_pouch_L: 'Подсумок Л',
  leg_pouch_R: 'Подсумок П',
};


// --- UI Icons ---

export const BackpackIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 1-2.25 2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 1 3 12m18 0v-1.21c0-.621-.504-1.125-1.125-1.125H4.125A1.125 1.125 0 0 0 3 9.79V12m18 0v2.25A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25V12m18 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 8.25v1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5h-9" />
    </svg>
);
// --- Slot Placeholder Icons ---
export const HeadSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);
export const ChestSlotIcon: React.FC<{className?: string}> = ({className}) => ( // For armor
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 3 12m0 0 6 6m-6-6h18M3 12l6-6m0 12V3" />
    </svg>
);
export const UnderwearSlotIcon: React.FC<{className?: string}> = ({className}) => ( // For clothing
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.009L3.69 19.19l-1.022-3.415a1.875 1.875 0 01.34-1.995l7.104-7.104a1.125 1.125 0 001.591 0L15 8.25l-.985 3.284A1.875 1.875 0 0015.032 15H17.25" />
    </svg>
);
export const LegsSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
);
export const FeetSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5" />
    </svg>
);
export const HandsSlotIcon: React.FC<{className?: string}> = ({className}) => ( // for gloves
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
export const WeaponSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
);
export const RingSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.75a8.25 8.25 0 0 1-16.5 0a8.25 8.25 0 0 1 16.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
);
export const AmuletSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 8.25-9 5.25-9-5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 14.25l9 5.25 9-5.25" />
    </svg>
);
export const ShoulderBagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.404 1.243-1.067 1.243H4.45c-.663 0-1.137-.586-1.067-1.243l1.263-12A1.125 1.125 0 0 1 5.714 9h12.572c.621 0 1.125.504 1.125 1.125Z" />
    </svg>
);
export const BraceletSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
);
export const PouchSlotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.353-.029.716-.029 1.07 0 1.13.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25V7.5m0 0h1.875a.375.375 0 0 0 .375-.375V6.375a.375.375 0 0 0-.375-.375h-1.875m-9.375 0h1.875a.375.375 0 0 1 .375.375V6.375a.375.375 0 0 1-.375-.375H4.875m0 0a.375.375 0 0 0-.375.375v1.125c0 .207.168.375.375.375h1.875" />
    </svg>
);

export const PlusIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

export const MinusIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 mr-2 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 13.5h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V15h-2.25a.75.75 0 0 1 0-1.5ZM4.5 19.5h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V21h-2.25a.75.75 0 0 1 0-1.5Z" />
  </svg>
);
export const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
  </svg>
);

export const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
  </svg>
);

export const BookOpenIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V3.75m0 12.552a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V15M12 12.75a2.25 2.25 0 0 0 2.25 2.25H18a2.25 2.25 0 0 0 2.25-2.25V15M12 12.75V15m0 0V8.25" />
</svg>
);

export const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

export const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const BoltIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

export const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const ShieldExclamationIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 12.963a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
</svg>
);

export const ArmorClassIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

export const CubeIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

export const ArrowsPointingOutIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);

export const Battery100Icon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75V3.75A1.5 1.5 0 0 0 13.5 2.25h-3A1.5 1.5 0 0 0 9 3.75v3m6 0v10.5A1.5 1.5 0 0 1 13.5 19.5h-3A1.5 1.5 0 0 1 9 18V6.75m6 0a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 6.75m6 0h.008v.008H15V6.75Z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9h4.5M9.75 12h4.5M9.75 15h4.5" /> 
  </svg>
);

export const AcademicCapIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path d="M3.75 13.5l3.75-3.75m0 0L11.25 15l3.75-3.75M7.5 17.25h9M3.75 17.25h16.5M4.5 12.75a3 3 0 000-5.5m15 5.5a3 3 0 010-5.5M12 4.875c-.38 0-.75.093-1.085.27C10.537 5.342 10.25 5.75 10.25 6.188v2.25c0 .437.287.846.665 1.037.378.178.706.27 1.085.27.38 0 .75-.093 1.085-.27.378-.178.665-.599.665-1.037v-2.25c0-.437-.287-.846-.665-1.037A2.24 2.24 0 0012 4.875z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v4.5m0 0H9.75m2.25 0H14.25M12 18.75V12M9.75 12V6.75M14.25 12V6.75" />
 </svg>
);

export const ScaleIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52c2.625 2.15 4.5 5.074 4.5 8.254a4.5 4.5 0 0 1-4.5 4.5C18.75 18 18.75 9.75 18.75 9.75m-13.5 0c-1.01.143-2.01.317-3 .52m3-.52c-2.625 2.15-4.5 5.074-4.5 8.254a4.5 4.5 0 0 0 4.5 4.5C5.25 18 5.25 9.75 5.25 9.75M12 4.5v15.75" />
  </svg>
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<{className?: string}> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.009L3.69 19.19l-1.022-3.415a1.875 1.875 0 01.34-1.995l7.104-7.104a1.125 1.125 0 001.591 0L15 8.25l-.985 3.284A1.875 1.875 0 0015.032 15H17.25m1.125-2.261L18.375 12.739M6 13.5h.008v.008H6V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 3.75h.008v.008H9.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


export const ShieldCheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.602M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 15c-2.67 0-8 1.335-8 4.007v1.245A2.25 2.25 0 0 0 6.25 22.5h11.5A2.25 2.25 0 0 0 20 20.252v-1.245C20 16.335 14.67 15 12 15Z" />
  </svg>
);

export const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

export const StarIcon: React.FC<{ className?: string, style?: CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')} style={style}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.401 4.753.392c.83.069 1.171 1.076.536 1.654l-3.616 3.14.922 4.672c.152.768-.669 1.36-1.33.976l-4.132-2.417-4.132 2.417c-.66.384-1.482-.208-1.33-.976l.922-4.672L.092 9.33c-.635-.578-.294-1.585.536-1.654l4.753-.392 1.83-4.401Z" clipRule="evenodd" />
  </svg>
);

export const BeakerIcon: React.FC<{className?: string, style?: CSSProperties}> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-6 h-6 ' + (className || '')} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.25v-4.5m0 4.5h-4.5m4.5 0L21 12m-6.75-3.75L3 12m8.25 8.25v6M6 16.5h12M6 16.5H3.75m2.25 0V12m2.25 4.5V12m0 0V9.75m5.25 2.25V12m2.25 4.5V12m0 0V9.75M9 16.5v3.75m6-3.75v3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 21h18" /> 
  </svg>
);

export const CircleStackIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>
);
export const UserCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const ChevronUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
      <path fillRule="evenodd" d="M9.47 6.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
    </svg>
);

export const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const BedIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10.5 1.5L12 3l1.5-1.5M10.5 1.5V3M13.5 1.5V3m-3 4.5h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 7.5a2.25 2.25 0 0 0-2.25 2.25v7.5A2.25 2.25 0 0 0 3.75 19.5h16.5a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 20.25 7.5" />
  </svg>
);

export const DiceIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.025 7.538c.005-.002.01-.002.015 0l.025.011c.144.065.22.23.155.374L10.05 11.25H12a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75V9c0-.28.16-.537.41-.658l1.365-.604ZM14.025 10.538c.005-.002.01-.002.015 0l.025.011c.144.065.22.23.155.374L13.05 14.25H15a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75V12c0-.28.16-.537.41-.658l1.365-.604Z" />
  </svg>
);
export const SunIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25m2.25-2.25a2.25 2.25 0 0 1 2.25 2.25M12 12a2.25 2.25 0 0 0 2.25-2.25M12 12a2.25 2.25 0 0 1-2.25-2.25" />
  </svg>
);

export const PencilSquareIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'w-5 h-5 ' + (className || '')}>
    <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
  </svg>
);


// Helper for Derived Stats Display
export interface ParsedDerivedStat {
  label: string;
  value: string;
  suffix: string;
  IconComponent: React.FC<{ className?: string }> | null;
  valueColor: string;
  iconColor: string;
  isNumeric: boolean; 
  isSkill?: boolean; 
  isApertureInfo?: boolean; 
  isHpInfo?: boolean;
  isHitDieInfo?: boolean; 
  hitDieValue?: number;
}

export const parseDerivedStatValue = (statString: string): ParsedDerivedStat => {
  // Check for specific Aperture stats that should now be skipped in the general derived stats list
  const apertureMaxMatch = statString.match(/^Макс\. Эссенция Апертуры:\s*(\d+)%\s*\((.*?)\)\s*$/);
  if (apertureMaxMatch) {
    return {
      label: "Макс. Эссенция", value: apertureMaxMatch[1], suffix: "% (" + apertureMaxMatch[2].trim() + ")",
      IconComponent: BeakerIcon, valueColor: 'text-cyan-400', iconColor: 'text-cyan-400', isNumeric: true, isApertureInfo: true,
    };
  }
  const apertureRegenMatch = statString.match(/^Регенерация Эссенции:\s*(.*?)$/);
   if (apertureRegenMatch) {
    return {
      label: "Регенерация Эссенции", value: apertureRegenMatch[1].trim(), suffix: "",
      IconComponent: BoltIcon, valueColor: 'text-emerald-400', iconColor: 'text-emerald-400', isNumeric: false, isApertureInfo: true,
    };
  }
  const apertureTalentMatch = statString.match(/^Талант Апертуры:\s*(.+)$/);
  if (apertureTalentMatch) {
    return {
      label: "Талант Апертуры", value: apertureTalentMatch[1].trim(), suffix: "",
      IconComponent: CircleStackIcon, valueColor: 'text-violet-400', iconColor: 'text-violet-400', isNumeric: false, isApertureInfo: true,
    };
  }
  const apertureRankMatch = statString.match(/^Ранг Мастера Гу:\s*(.+)$/);
  if (apertureRankMatch) {
    return {
      label: "Ранг Мастера Гу", value: apertureRankMatch[1].trim(), suffix: "",
      IconComponent: UserCircleIcon, valueColor: 'text-amber-400', iconColor: 'text-amber-400', isNumeric: false, isApertureInfo: true,
    };
  }
  const hpMatch = statString.match(/^(Хитпоинты|HP):\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (hpMatch) {
    return {
        label: "Хитпоинты", value: `${hpMatch[2]} / ${hpMatch[3]}`, suffix: "",
        IconComponent: HeartIcon, valueColor: 'text-rose-400', iconColor: 'text-rose-500', 
        isNumeric: false, // It's a string "X / Y"
        isHpInfo: true,
    };
  }
  const hdMatch = statString.match(/^(Кости Хитов|HD):\s*(\d+)\s*\/\s*(\d+)\s*\(d(\d+)\)$/);
    if (hdMatch) {
        return {
            label: `Кости Хитов`, value: `${hdMatch[2]} / ${hdMatch[3]}`, suffix: `(d${hdMatch[4]})`, // Suffix now only contains die type
            IconComponent: DiceIcon, valueColor: 'text-emerald-400', iconColor: 'text-emerald-500', 
            isNumeric: false, // It's a string "X / Y"
            isHpInfo: true,
            isHitDieInfo: true,
            hitDieValue: parseInt(hdMatch[4])
        };
    }
  const exhaustionMatch = statString.match(/^Уровень Истощения:\s*(\d)\s*(.*)$/);
  if (exhaustionMatch) {
    return {
        label: "Истощение", value: exhaustionMatch[1], suffix: exhaustionMatch[2].trim(),
        IconComponent: ShieldExclamationIcon, valueColor: parseInt(exhaustionMatch[1]) > 0 ? 'text-amber-400' : 'text-zinc-300', iconColor: 'text-amber-500', 
        isNumeric: true, 
        isHpInfo: true,
    };
  }


  const skillMatch = statString.match(/^Навык:\s*(.*?):\s*([+-]?\d+)\s*(.*)$/);
  if (skillMatch) {
    return {
      label: skillMatch[1].trim(), 
      value: skillMatch[2].trim(),
      suffix: skillMatch[3].trim(),
      IconComponent: ListBulletIcon, 
      valueColor: 'text-teal-300', 
      iconColor: 'text-teal-400',   
      isNumeric: true,
      isSkill: true,
    };
  }

  const numericMatch = statString.match(/^(.*?):\s*([+-]?\d+)(.*)$/);
  if (numericMatch) {
    let label = numericMatch[1].trim();
    let value = numericMatch[2].trim();
    let suffix = numericMatch[3].trim();
    let IconComponent: React.FC<{ className?: string }> | null = null;
    let valueColor = 'text-zinc-100'; 
    let iconColor = 'text-indigo-400';   

    if (label.startsWith("Класс Брони (КБ)")) {
      IconComponent = ArmorClassIcon; valueColor = "text-sky-400"; iconColor = "text-sky-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.strength)) {
      IconComponent = CubeIcon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.dexterity)) {
      IconComponent = ArrowsPointingOutIcon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.constitution)) {
      IconComponent = Battery100Icon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.intelligence)) {
      IconComponent = AcademicCapIcon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.wisdom)) {
      IconComponent = ScaleIcon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith(SAVING_THROW_NAMES_RU.charisma)) {
      IconComponent = ChatBubbleOvalLeftEllipsisIcon; valueColor = "text-violet-400"; iconColor = "text-violet-400";
    } else if (label.startsWith("Концептуальные ПЗ")) { //This will be replaced by HP
      IconComponent = HeartIcon; valueColor = "text-emerald-400"; iconColor = "text-emerald-400";
    } else if (label.startsWith("Концептуальная Инициатива")) {
      IconComponent = BoltIcon; valueColor = "text-amber-400"; iconColor = "text-amber-400";
    } else if (label.startsWith("Пассивная Внимательность")) {
      IconComponent = EyeIcon; valueColor = "text-cyan-400"; iconColor = "text-cyan-400";
    } else if (label.startsWith("Скорость")) {
      IconComponent = TrendingUpIcon; valueColor = "text-orange-400"; iconColor = "text-orange-400";
    } else if (label.startsWith("Известные языки")) {
      IconComponent = BookOpenIcon; valueColor = "text-indigo-400"; iconColor = "text-indigo-400";
    } else if (label.startsWith("Бонус Умения")) {
      IconComponent = StarIcon; valueColor = "text-amber-300"; iconColor = "text-amber-400";
    }
    return { label, value, suffix, IconComponent, valueColor, iconColor, isNumeric: true, isSkill: false };
  }

  const textualMatch = statString.match(/^(.*?):\s*(.+)$/);
  if (textualMatch) {
    let icon = InfoIcon;
    let valColor = 'text-zinc-300';
    let icoColor = 'text-sky-400';

    return {
      label: textualMatch[1].trim(),
      value: textualMatch[2].trim(),
      suffix: '',
      IconComponent: icon, 
      valueColor: valColor, 
      iconColor: icoColor,    
      isNumeric: false,
      isSkill: false,
    };
  }
  
  return {
    label: statString, 
    value: '',
    suffix: '',
    IconComponent: InfoIcon,
    valueColor: 'text-zinc-300',
    iconColor: 'text-sky-400',
    isNumeric: false,
    isSkill: false,
  };
};