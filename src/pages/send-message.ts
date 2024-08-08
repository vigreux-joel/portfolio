export const prerender = false;


export const POST: ({request}: { request: any }) => Response = ({request}) => {
    return new Response(JSON.stringify({
        status: 200,
        message: "success"
    }), {
        headers: {"Content-Type": "application/json"},
        status: 200
    });
}
