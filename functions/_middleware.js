// Send the bare domain (twistedoaksstudio.com) to the www address, keeping the path and query.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'twistedoaksstudio.com') {
    url.hostname = 'www.twistedoaksstudio.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
