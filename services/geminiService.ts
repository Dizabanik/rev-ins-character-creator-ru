


import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Character, Feat, DndAttribute, Skill } from '../types'; 
import { 
    GEMINI_MODEL_TEXT, DND_ATTRIBUTE_NAMES_RU, calculateModifier, AVAILABLE_SKILLS, 
    APERTURE_GRADES, CHARACTER_RANKS, getEssenceDetails, getEssenceCondensationDetails
} from '../constants'; 

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY для Gemini не установлен. Функции ИИ не будут работать.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const formatGameTimeForPrompt = (totalHours: number): string => {
    const days = Math.floor(totalHours / 24) + 1;
    const hours = totalHours % 24;
    return `День ${days}, ${String(hours).padStart(2, '0')}:00`;
};

export const generateBackstory = async (character: Character): Promise<string> => {
  if (!ai) {
    return "API-ключ Gemini не настроен. Невозможно сгенерировать предысторию.";
  }

  const attributesRussian = Object.keys(DND_ATTRIBUTE_NAMES_RU).map(key => {
    const attrKey = key as DndAttribute;
    return `      ${DND_ATTRIBUTE_NAMES_RU[attrKey]}: ${character.attributes[attrKey]} (Мод: ${calculateModifier(character.attributes[attrKey])})`;
  }).join('\n');


  const skillsRussian = character.selectedSkills.map(s => s.name).join(', ') || 'Не указаны';
  
  const featsAndFlaws: Feat[] = character.activeFeats; 
  const featsRussian = featsAndFlaws.length > 0 
    ? featsAndFlaws.map(f => `${f.name}${f.isFlaw ? ' (Изъян)' : ''}`).join(', ') 
    : 'Нет активных';
  
  const traitsRussian = character.selectedTraits.map(t => `${t.name}${t.modificationPointCost < 0 ? ' (Изъян)' : ''}`).join(', ') || 'Пока нет особо выдающихся';
  const itemsRussian = character.selectedItems.map(i => i.name).join(', ') || 'Ничего, кроме одежды на теле';
  
  let madnessRussian = 'В здравом уме, но напуган и дезориентирован внезапной переменой.';
  if (character.madnessEffect) {
    const typeRu = character.madnessEffect.type === 'short-term' ? 'краткосрочное' :
                   character.madnessEffect.type === 'long-term' ? 'долгосрочное' :
                   'бессрочное';
    madnessRussian = `${character.madnessEffect.name} (${typeRu}): ${character.madnessEffect.description}`;
  }

  let raceInfo = "Раса не определена (считайте человеком по умолчанию для контекста).";
  if (character.selectedRace) {
    raceInfo = `Раса: ${character.selectedRace.name}.`;
    if (character.selectedRace.specialAbilities.length > 0) {
        raceInfo += ` Ключевые расовые способности: ${character.selectedRace.specialAbilities.join(', ')}.`;
    } else {
        raceInfo += " Обладает типичными для своей расы характеристиками.";
    }
    if (character.selectedRace.textualEffects && character.selectedRace.textualEffects.length > 0) {
        raceInfo += ` Особые расовые эффекты/уязвимости: ${character.selectedRace.textualEffects.join(', ')}.`;
    }
    if (character.selectedRace.skillModifiers && Object.keys(character.selectedRace.skillModifiers).length > 0) {
        const skillModsString = Object.entries(character.selectedRace.skillModifiers)
            .map(([skillId, mod]) => {
                const skill = AVAILABLE_SKILLS.find(s => s.id === skillId);
                return `${skill ? skill.name : skillId}: ${mod > 0 ? '+' : ''}${mod}`;
            })
            .join(', ');
        raceInfo += ` Прямые расовые модификаторы навыков: ${skillModsString}.`;
    }
  }

  let apertureInfo = "Состояние апертуры и первобытной эссенции не определено.";
  const grade = APERTURE_GRADES.find(g => g.id === character.apertureGradeId);
  const rank = CHARACTER_RANKS.find(r => r.id === character.characterRankId);
  const essenceDetails = getEssenceDetails(character.characterRankId, character.selectedEssenceStageId);
  const essencePct = character.currentEssencePercentage;
  const specificMaxEssence = character.specificMaxEssence;

  if (grade && rank && essenceDetails && character.selectedEssenceStageId && essencePct !== undefined && specificMaxEssence !== undefined) {
    apertureInfo = `
    Талант Апертуры: ${grade.name} (Мин/Макс для грейда: ${grade.minMaxEssence}-${grade.maxMaxEssence}%, Установленный макс.: ${specificMaxEssence}%, Восстановление ~${grade.recoveryTimeHours} ч.)
    Ранг Мастера Гу: ${rank.name} (${rank.rankColorGroup})
    Стадия Эссенции: ${essenceDetails.name}
    Первобытная Эссенция: ${essenceDetails.stageSpecificEssenceName} (Цвет: ${essenceDetails.colorName}, Качество: ${rank.condensation})
    Текущее состояние эссенции: ${essencePct.toFixed(1)}% / ${specificMaxEssence}%
    `;

    const condensationDetails = getEssenceCondensationDetails(rank.id, character.selectedEssenceStageId);
    if (condensationDetails.length > 0) {
        const mostRelevantComparison = condensationDetails.find(cd => cd.factor > 1 && cd.factor < 100) || condensationDetails[0]; 
        if (mostRelevantComparison) {
            const factorFormatted = mostRelevantComparison.factor.toFixed(1);
            apertureInfo += ` Конденсация: 1% этой эссенции примерно эквивалентен ${factorFormatted}% эссенции ${mostRelevantComparison.comparisonStageName}.`;
        } else {
            apertureInfo += ` Конденсация: Эссенция имеет определенную степень концентрации по сравнению с другими типами.`;
        }
    }
  }

  const physicalState = `
    Физическое состояние:
      Хитпоинты: ${character.currentHp} / ${character.maxHp}
      Кости Хитов: ${character.currentHitDice} / ${character.maxHitDice} (d${character.hitDieType})
      Уровень Истощения: ${character.exhaustionLevel} (0 - нет, 6 - смерть)
      Игровое Время: ${formatGameTimeForPrompt(character.gameTimeHours)}
      Время с последнего продолжительного отдыха: ${character.lastLongRestEndTime > 0 ? formatGameTimeForPrompt(character.gameTimeHours - character.lastLongRestEndTime) + ' назад' : 'Неизвестно / Никогда'}
  `;


  const prompt = `
    Сгенерируй краткую и мрачную предысторию (около 150-200 слов) для персонажа, который был внезапно телепортирован из своего родного мира (предположим общий контекст средневекового фэнтези или современной Земли, оставайся неопределенным насчет родного мира) в жестокий мир Преподобного Губителя (Reverend Insanity).
    У него НЕТ предварительных знаний о Гу, совершенствовании, первобытной эссенции или апертурах. Его инстинкты выживания активизируются.
    Детали персонажа следующие:
    Имя: ${character.name}
    Уровень: ${character.level} (Бонус Умения: +${character.proficiencyBonus})
    ${raceInfo}
    Итоговые Характеристики (по шкале примерно от 3 до 18, где 10 - средний человек, с указанием модификатора; включают расовые модификаторы):
    ${attributesRussian}
    
    Владение Навыками (тренированные способности, к которым применяется Бонус Умения): ${skillsRussian}
    
    Активные Черты (особые таланты или изъяны, автоматически активные благодаря характеристикам или выбору): ${featsRussian}

    Примечательные Особенности/Изъяны (Трейты): ${traitsRussian}
    
    Стартовые Предметы, которые оказались при нем во время телепортации: ${itemsRussian}
    
    Текущее Психическое Состояние (если есть специфическое начальное безумие): ${madnessRussian}

    ${physicalState}

    Информация об Апертуре и Первобытной Эссенции (если персонаж уже обладает этими знаниями или они проявились инстинктивно):
    ${apertureInfo}

    Предыстория должна сосредоточиться на его немедленном замешательстве, страхе и зарождающемся осознании опасной новой среды.
    Как его расовые особенности, итоговые характеристики, навыки, черты, предметы, физическое состояние (HP, истощение) ИЛИ состояние его апертуры/эссенции (включая её относительную "ценность" из-за конденсации, если применимо и известно ему) влияют на его первые несколько мгновений или часов выживания или его немедленные реакции?
    Если у персонажа есть изъяны (в чертах или трейтах), как они усугубляют его положение?
    Подчеркни шок и борьбу неподготовленного чужака.
    Тон должен быть безрадостным, прагматичным и отражать суровые реалии мира Преподобного Губителя.
    НЕ давай персонажу никаких особых знаний или способностей, связанных с миром Гу, если только это не подразумевается его расой, апертурой или рангом (например, Волосатый человек может инстинктивно чувствовать ценность материалов для Гу; персонаж с активной апертурой может ощущать свою внутреннюю энергию, не понимая ее природы или относительной силы).
    Подчеркни, как его существующие навыки или черты могут быть удивительно полезны или трагически недостаточны в этом новом контексте.
    Ответ должен быть НА РУССКОМ ЯЗЫКЕ.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Ошибка при генерации предыстории с помощью Gemini:", error);
    if (error instanceof Error) {
        return `Не удалось сгенерировать предысторию. Ошибка: ${error.message}. Убедитесь, что ваш API-ключ действителен и имеет доступ к модели '${GEMINI_MODEL_TEXT}'.`;
    }
    return "Не удалось сгенерировать предысторию из-за неизвестной ошибки.";
  }
};
