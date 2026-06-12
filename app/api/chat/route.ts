import { convertToModelMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { companyManual } from '../../../data/manual';

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `あなたは優秀な社内アシスタントです。以下のルールとマニュアルに従って回答してください。
            <system_rules>
            - マニュアルにない質問には『規程にありません』と答えること。
            - 回答はMarkdownの箇条書きを多用して読みやすくすること。
            - 丁寧な敬語を使うこと。
            </system_rules>

            <manual_data>
            ${companyManual}
            </manual_data>`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}