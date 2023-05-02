export default async function tryLogin(setIsLoading, axios) {
    try {
        setIsLoading(true);
        if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
            await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });
            window.location.replace("/profile");
        }
    }
    catch { }
    finally {
        setIsLoading(false);
    }
}