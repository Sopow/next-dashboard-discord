import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/src/server/api/trpc";
import axios from "axios";

export const languageRouter = createTRPCRouter({
    getCountry: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const response = await axios.get(
                `https://restcountries.com/v3.1/alpha/${input === "en" ? "gb" : input}`,
            );
            return {
                name: response.data[0].name.common,
                language:
                    response.data[0].languages[
                    Object.keys(response.data[0].languages)[0]
                    ],
                flag: response.data[0].flags.png,
            };
        }),

    getMultipleCountries: publicProcedure
        .input(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            // if input contain "en", replace en with "gb"
            const inputWithGb = input.map((item) => (item === "en" ? "gb" : item));
            const response = await axios.get(
                `https://restcountries.com/v3.1/alpha?codes=${inputWithGb.join(",")}`,
            );
            return response.data.map((country: any) => ({
                name: country.name.common,
                language: country.languages[Object.keys(country.languages)[0]],
                flag: country.flags.png,
                alpha2Code: country.cca2 === "GB" ? "en" : country.cca2,
            }));
        }),
});
