import { AuthApiClient } from '../src/api/auth-api-client';
import { ServiceApiClient } from '../src/api/service-api-client';
import { OpenlinkClient } from '../src/openlink/client/openlink-client';

async function main() {
    const COOKIE = '__T_=1; TIARA=ioTQ5o9XRobpR8hky6purevXkH112rtJqdtfpyhrRsFxoZD2cTAofJuxXO8VLCpjH_cwKO4YWfu9XPd8Y9kKGh.TI.8PtoGUbxq5WEBEd8U0; _karb=TpCEcdUEFNex7e_z_1678335455372; webid=4196c986b3864770ac89e93f1a7bad2f; webid_ts=1678339613788; _kadu=DlGiU0tND0XceQVZ_1678418770688; kd_lang=ko; _ga=GA1.2.1783500666.1679964523; _kdt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZlbG9wZXJfaWQiOjMyMzY3NzYsInRva2VuIjoiZTJhZWJkYjJkMjdkMGM4MzAyZWVlNTBiYTU0ZmVjYzgyM2QxYmE0OTAzZmZmNzc1YzA5MDNjYjExMDY2ZDRlYiJ9.AWRu05Jp3d3Y1b2nirXoMCHA1fJpZBzzjypLQBvD0As; _kawlt=10OHduyLdASntVtmMKQEiVpQY9g_vc4fC5DjoMlgpyu33knE2-bnoKkpnaEnbcQtwt-FYPYNQMtzBIJHBLWz7_gyQqBcwH8B5hHwnO_I3CuRo_Oyzw-H0_HUAxaGXs-m; _kawltea=1684372144; _karmt=3Hs8AnM0qtZvl6zVOLCgZ3fUjR7I61metGTGMHBhlz380BE1yfN13Ut2K6SfvI_c; _karmtea=1684382944; _kahai=b26bcf9d27e946ac0a0223ccde8ed92de78db19146f3b0b8a7ef4078c8f57fb2; _T_ANO=jQa+8gfeIDYX+Lk+lp+kAzHU7c5hl803q4eylCWQc7UrOMJ/oj4rJvd3LfJWBs0OXgjBz51k0K/UN72CBkeUcNVdH0qMs1HgSUXrQ2VfKR7pBj3pa4FgdPOwFQL6vbH1/K/59mFALa0PV6Cuu4omF6pNn+1JQ37DHiLTnu1djbpEZ0K551wk/jJC9200tKfdR8CJcyyTbGf6Mr/tGjzbQw+CSxes/HU3KhR9d5HMkpqody8esoAp+vECYzoQ4rpP/d755o3E7Vw8FkNT6mnSPF/tq0y9bT0eMX5Oj9Ablv6Dnua/w0P7JGWI/ZJGhArgYoo+6UAPt104K8/YPe4FyA=='
    const LINKID = 2;

    const api = await AuthApiClient.create({}, COOKIE);
    const serviceApi = await ServiceApiClient.create({}, COOKIE);

    const loginRes = await api.login();

    console.log(loginRes)

    const info = await serviceApi.infoLink(2);

    console.log(info)

    const client = await OpenlinkClient.create({}, 2, COOKIE);

    await client.login(loginRes);

    client.on('message', data => {
        console.log(data.content)
    });

    client.on('on_packet', console.log)
}

main()