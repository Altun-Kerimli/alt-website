import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'tr', 'az', 'uk', 'ru', 'de'];

export default getRequestConfig(async ({requestLocale}) => {
  // 1. Await the new requestLocale Promise (Required for Next 15+)
  const locale = await requestLocale;

  // 2. Validate the unwrapped string
  if (!locale || !locales.includes(locale as any)) notFound();
  
  // 3. Return BOTH the locale and the messages
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});