export default async function tryLogin(setIsLoading, axios, redirect = true) {
    try {
        if (!sessionStorage.getItem("token") || !sessionStorage.getItem("user")) throw new Error();

        setIsLoading(true);
        if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
            await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });
            if (redirect) window.location.replace("/dashboard");
        }
    }
    catch { 
        if (!redirect) window.location.replace("/entrar");
    }
    finally {
        setIsLoading(false);
    }
}