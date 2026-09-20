import { SlideData } from '../types';

export interface ExportProgress {
  step: string;
  percent: number;
  presentationId?: string;
  presentationUrl?: string;
}

export const exportToGoogleSlides = async (
  accessToken: string,
  slides: SlideData[],
  onProgress?: (progress: ExportProgress) => void
): Promise<{ presentationId: string; presentationUrl: string }> => {
  onProgress?.({ step: '正在创建 Google Slides 演示文稿...', percent: 10 });

  // 1. Create the presentation
  const title = '企业多智能体系统（Multi-Agent）部署 · 信息采集与现状调研宣贯方案';
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`创建 Google Slides 失败: ${createRes.status} ${errText}`);
  }

  const presData = await createRes.json();
  const presentationId = presData.presentationId;
  const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  onProgress?.({
    step: '演示文稿创建成功，正在批量构建 15 页幻灯片内容...',
    percent: 25,
    presentationId,
    presentationUrl,
  });

  // 2. Fetch the created presentation to inspect default slides
  const defaultSlideId = presData.slides?.[0]?.objectId;

  // We batch slides in chunks of 5 for safety and reliability
  const CHUNK_SIZE = 5;
  const totalChunks = Math.ceil(slides.length / CHUNK_SIZE);

  for (let c = 0; c < totalChunks; c++) {
    const chunkSlides = slides.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
    const requests: any[] = [];

    for (let i = 0; i < chunkSlides.length; i++) {
      const slide = chunkSlides[i];
      const globalIdx = c * CHUNK_SIZE + i;
      const slideObjectId = `slide_mas_${slide.id}`;

      // Create a slide
      requests.push({
        createSlide: {
          objectId: slideObjectId,
          insertionIndex: globalIdx,
          slideLayoutReference: { predefinedLayout: 'BLANK' },
        },
      });

      // Slide dark top header band
      const headerBgId = `hdr_bg_${slide.id}`;
      requests.push({
        createShape: {
          objectId: headerBgId,
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 720, unit: 'PT' },
              height: { magnitude: 75, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 0,
              translateY: 0,
              unit: 'PT',
            },
          },
        },
      });

      // Color header band (#0F172A - dark tech navy)
      requests.push({
        updateShapeProperties: {
          objectId: headerBgId,
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: {
                color: { rgbColor: { red: 0.06, green: 0.09, blue: 0.16 } },
              },
            },
            outline: { propertyState: 'NOT_RENDERED' },
          },
          fields: 'shapeBackgroundFill.solidFill.color,outline',
        },
      });

      // Header Title text box
      const titleId = `title_${slide.id}`;
      requests.push({
        createShape: {
          objectId: titleId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 680, unit: 'PT' },
              height: { magnitude: 40, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 24,
              translateY: 10,
              unit: 'PT',
            },
          },
        },
      });

      const headerText = `【P${slide.slideNumber} · ${slide.category}】 ${slide.actionTitle}`;
      requests.push({
        insertText: {
          objectId: titleId,
          text: headerText,
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: titleId,
          style: {
            bold: true,
            fontSize: { magnitude: 15, unit: 'PT' },
            foregroundColor: {
              opaqueColor: {
                rgbColor: { red: 0.98, green: 0.98, blue: 1.0 },
              },
            },
          },
          fields: 'bold,fontSize,foregroundColor',
        },
      });

      // Subtitle / Objective box
      const subId = `sub_${slide.id}`;
      requests.push({
        createShape: {
          objectId: subId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 680, unit: 'PT' },
              height: { magnitude: 22, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 24,
              translateY: 48,
              unit: 'PT',
            },
          },
        },
      });

      requests.push({
        insertText: {
          objectId: subId,
          text: `核心目标: ${slide.objective} ${slide.subTitle ? `| ${slide.subTitle}` : ''}`,
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: subId,
          style: {
            fontSize: { magnitude: 9.5, unit: 'PT' },
            foregroundColor: {
              opaqueColor: {
                rgbColor: { red: 0.58, green: 0.77, blue: 0.99 },
              },
            },
          },
          fields: 'fontSize,foregroundColor',
        },
      });

      // Body Main Card (Light background container)
      const bodyId = `body_${slide.id}`;
      requests.push({
        createShape: {
          objectId: bodyId,
          shapeType: 'ROUNDED_RECTANGLE',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 672, unit: 'PT' },
              height: { magnitude: 250, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 24,
              translateY: 88,
              unit: 'PT',
            },
          },
        },
      });

      requests.push({
        updateShapeProperties: {
          objectId: bodyId,
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: {
                color: { rgbColor: { red: 0.97, green: 0.98, blue: 1.0 } },
              },
            },
            outline: {
              outlineFill: {
                solidFill: {
                  color: { rgbColor: { red: 0.82, green: 0.88, blue: 0.95 } },
                },
              },
              weight: { magnitude: 1, unit: 'PT' },
            },
          },
          fields: 'shapeBackgroundFill.solidFill.color,outline',
        },
      });

      // Compile body content text
      let bodyText = '';
      if (slide.highlightBanner) {
        bodyText += `📌 核心主张: ${slide.highlightBanner}\n\n`;
      }

      if (slide.cards && slide.cards.length > 0) {
        slide.cards.forEach((card, idx) => {
          bodyText += `▶ ${card.title} (${card.badge || '要点'})\n`;
          card.items.forEach((item) => {
            bodyText += `  • ${item}\n`;
          });
          if (idx < slide.cards!.length - 1) bodyText += '\n';
        });
      }

      if (slide.flowSteps && slide.flowSteps.length > 0) {
        bodyText += '▶ 流程推进关键节点:\n';
        slide.flowSteps.forEach((st) => {
          bodyText += `  [${st.step}] ${st.label} (${st.role}): ${st.desc}\n`;
        });
        bodyText += '\n';
      }

      if (slide.pyramidLevels && slide.pyramidLevels.length > 0) {
        bodyText += '▶ 业务规则沉淀三层金字塔:\n';
        slide.pyramidLevels.forEach((pl) => {
          bodyText += `  • ${pl.level} - ${pl.title}: ${pl.desc} ➔ 目标: ${pl.target}\n`;
        });
        bodyText += '\n';
      }

      if (slide.table) {
        bodyText += `▶ ${slide.table.headers.join(' | ')}\n`;
        slide.table.rows.forEach((r) => {
          bodyText += `  • ${r.join(' ➔ ')}\n`;
        });
        bodyText += '\n';
      }

      if (slide.timeline && slide.timeline.length > 0) {
        bodyText += '▶ 推进计划与里程碑排期 (7~10 个工作日):\n';
        slide.timeline.forEach((tl) => {
          bodyText += `  [${tl.day}] ${tl.phase} (责任人: ${tl.owner}):\n`;
          tl.tasks.forEach((t) => {
            bodyText += `    - ${t}\n`;
          });
        });
      }

      requests.push({
        insertText: {
          objectId: bodyId,
          text: bodyText.trim(),
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: bodyId,
          style: {
            fontSize: { magnitude: 10, unit: 'PT' },
            foregroundColor: {
              opaqueColor: {
                rgbColor: { red: 0.12, green: 0.16, blue: 0.22 },
              },
            },
          },
          fields: 'fontSize,foregroundColor',
        },
      });

      // Speaker Notes text box at bottom footer
      const notesBoxId = `spk_${slide.id}`;
      requests.push({
        createShape: {
          objectId: notesBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 672, unit: 'PT' },
              height: { magnitude: 50, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 24,
              translateY: 345,
              unit: 'PT',
            },
          },
        },
      });

      requests.push({
        insertText: {
          objectId: notesBoxId,
          text: `🎙️ 演讲备注 (Speaker Notes): ${slide.speakerNotes}`,
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: notesBoxId,
          style: {
            fontSize: { magnitude: 8.5, unit: 'PT' },
            foregroundColor: {
              opaqueColor: {
                rgbColor: { red: 0.45, green: 0.52, blue: 0.62 },
              },
            },
            italic: true,
          },
          fields: 'fontSize,foregroundColor,italic',
        },
      });
    }

    // Execute batch update for this chunk
    const updateRes = await fetch(
      `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.warn('Batch update chunk warning:', err);
    }

    const currentPercent = 25 + Math.round(((c + 1) / totalChunks) * 65);
    onProgress?.({
      step: `已写入 ${(c + 1) * CHUNK_SIZE > slides.length ? slides.length : (c + 1) * CHUNK_SIZE} / ${slides.length} 页幻灯片...`,
      percent: currentPercent,
      presentationId,
      presentationUrl,
    });
  }

  // 3. Remove initial blank title slide if it exists
  if (defaultSlideId) {
    try {
      await fetch(
        `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{ deleteObject: { objectId: defaultSlideId } }],
          }),
        }
      );
    } catch (e) {
      console.warn('Failed to remove default slide, ignoring:', e);
    }
  }

  onProgress?.({
    step: 'Google Slides 演示文稿生成完成！可直接在云端查看与演讲。',
    percent: 100,
    presentationId,
    presentationUrl,
  });

  return { presentationId, presentationUrl };
};
