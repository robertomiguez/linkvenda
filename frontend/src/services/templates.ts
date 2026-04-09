const intros = [
  "🔥 OFERTA IMPERDÍVEL!",
  "🚀 SUPER DESCONTO NA ÁREA!",
  "🚨 ALERTA DE PREÇO BAIXO!",
  "✨ Selecionamos especialmente para você:",
  "😱 Você não vai acreditar nesse preço:",
  "🎯 Achado do dia!",
  "💥 Queima de estoque!",
  "⚡ Oferta relâmpago ativada!",
  "🏃 Corre que tá barato demais!",
  "🤑 Preço imbatível liberado!",
  "💎 Raridade com desconto:",
  "🤯 Baixou tudo! Olha isso:",
  "👀 De olho nessa promoção incrível:",
  "🤩 Separamos o melhor para você:",
  "🔥 Oportunidade ÚNICA passando pela sua timeline!",
  "🎉 Oferta especial fresquinha:",
  "🌟 Simplesmente a melhor compra do dia:",
  "🎈 Promoção surpresa! Olha só:",
  "🛍️ Pra quem ama economizar:",
  "💳 Prepare o cartão, porque essa tá demais:",
  "🌈 Achadinho perfeito e barato:",
  "🎯 Foco nessa oferta matadora:",
  "💣 Preço explosivo! Aproveite:",
  "⭐ Avaliação máxima e preço mínimo:",
  "👑 Uma verdadeira pechincha:",
]

const bodies = [
  "{product_name}\n💰 Apenas {price}",
  "{product_name}\nDe ~R$ ???~ por apenas {price}!",
  "O sensacional {product_name} está com preço especial.\nLevando agora você paga só {price}!",
  "Preço inacreditável: {price} em {product_name}!",
  "Garanta seu {product_name} pela bagatela de {price}!",
  "Olha esse preço: {price} no {product_name} 🤑",
  "Não pague mais caro. Leve {product_name} por apenas {price}!",
  "{product_name} acabou de bater seu menor preço: {price}",
  "Quem compara, compra aqui! {product_name} saindo por {price}.",
  "Seu novo {product_name} te espera. Tudo isso por apenas {price}!",
  "Chegou a hora de ter o seu {product_name} pagando apenas {price}!",
  "O queridinho do momento: {product_name} na promoção por {price} 😍",
  "Leve luxo e qualidade com {product_name} pelo valor absurdo de {price}!!",
  "{product_name} - Qualidade garantida por apenas {price}.",
  "Oportunidade de levar {product_name} pra casa desembolsando só {price}!",
  "Já imaginou o seu novo {product_name}? E por apenas {price}? É real!",
  "Aproveite a exclusividade do {product_name} por incríveis {price} ✨",
  "{product_name} com custo-benefício surreal: só {price} dinheiros!",
  "Fica a dica: {product_name} despencou para {price}!",
  "Sabe aquele {product_name} que você queria? Hoje ele sai a {price}!",
  "{product_name} por {price}? Sim, você leu certo! 😲",
  "A chance de ter {product_name} chegou. Pagamento fácil de {price}.",
  "Estoque renovado do {product_name} e com o precinho amigo de {price}!",
  "Um espetáculo de produto! {product_name} marcando {price} na etiqueta verde.",
  "Seja o primeiro a agarrar o {product_name} por esta pechincha de {price}!",
]

const outtros = [
  "⚠️ Pode acabar a qualquer momento!\n\n👉 Compre agora: {link}",
  "🛒 Garanta o seu antes que acabem os estoques:\n{link}",
  "⏳ Link exclusivo com o valor especial:\n{link}",
  "✅ Site confiável, compra segura:\n{link}",
  "🏃 Corra antes que acabe o estoque:\n{link}",
  "👇 Clica aqui para não perder:\n{link}",
  "🛒 Acesse o link e aproveite:\n👉 {link}",
  "📦 Link seguro. Compre direto aqui:\n{link}",
  "🎁 Uma oportunidade dessas não dá pra perder! Acesse:\n{link}",
  "🤝 Garanta o seu pelo link oficial:\n{link}",
  "🚀 Não perca tempo, acesse a página oficial:\n🔗 {link}",
  "⚡ Promoção por tempo contadíssimo. Garanta o seu clicando:\n✔️ {link}",
  "🛍️ Adicione ao carrinho agora mesmo!\n👉 {link}",
  "📲 Clique, compre e receba rapidinho:\n{link}",
  "🔥 Estoque limitadíssimo! Pega o seu aqui:\n{link}",
  "✨ Para mais detalhes e compra, esse é o link:\n📍 {link}",
  "💳 Parcele suas compras com facilidade. Clica aí:\n➡️ {link}",
  "🏆 O melhor preço está a um clique de distância:\n{link}",
  "⭐ Link testado e aprovado. Pode confiar e comprar:\n✅ {link}",
  "🚚 Veja opções de frete grátis clicando:\n🔗 {link}",
  "🗣️ Compartilhe essa oferta antes de comprar pelo link:\n{link}",
  "💡 Seja esperto, compre no precinho clicando abaixo:\n{link}",
  "🎯 A sorte bateu na sua porta, abra o link:\n👉 {link}",
  "⏰ O tempo está passando, confirme no link:\n⏳ {link}",
  "👀 Clique e comprove você mesmo essa maravilha:\n{link}",
]

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function truncateTitle(title: string): string {
  if (!title) return 'Produto incrível';
  return title.split(' ').slice(0, 3).join(' ');
}

export function generatePost(title: string, price: string, url: string): string {
  const safeTitle = truncateTitle(title)
  const safePrice = price || 'R$ --,--'
  const safeUrl = url || 'https://linkvenda.com'

  const template = `${getRandom(intros)}\n\n${getRandom(bodies)}\n\n${getRandom(outtros)}`

  // Replace all placeholders directly in place.
  // The URL stays exactly where {link} is in the template — no stripping, no re-appending.
  // This prevents double-link issues on mobile share APIs.
  const finalContent = template
    .replace(/{product_name}/g, safeTitle)
    .replace(/{price}/g, safePrice)
    .replace(/{link}/g, safeUrl)

  return finalContent.trim()
}
