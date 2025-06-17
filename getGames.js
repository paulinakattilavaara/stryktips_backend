import puppeteer from "puppeteer";

const getGames = async () => {
    const browser = await puppeteer.launch({
        headless: true, // sätt false om man vill se scrapingen in action. 
        defaultViewport: null,
        // args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // console.log('Browser version:', await browser.version());
    // console.log('User agent:', await browser.userAgent());

    await page.goto(process.env.GAME_URL, {
        waitUntil: "networkidle2",
    });

    try {
        // Detta är för att acceptera cookies så datan kan laddas in.
        await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 });

        await page.click('#onetrust-accept-btn-handler');
        // console.log("Cookie consent accepted");
    } catch (error) {
        console.log("No cookie consent found or already accepted");
    }

    // try {
    //     // Detta är elementet som håller games-raderna. 
    //     await page.waitForSelector(".coupon-row-description-primary"), { timeout: 10000 };
    // } catch (error) {
    //     if (error.name === 'TimeoutError') {
    //         console.log("No games available.");
    //     } else {
    //         console.error("An error occurred: ", error);
    //     }
    // }

    const elementExists = await page.$('.coupon-row-description-primary');

    if (!elementExists) {
        console.log("No games available today.");
        await browser.close(); // Stänger browsern och avslutar programmet tidigt
        return [];
    }



    const data = await page.evaluate(() => {
        const gameList = document.querySelectorAll('.coupon-row-description-primary');

        if (gameList.length === 0) {
            return null;
        }

        return Array.from(gameList).map((game) => {
            const games = game.innerText.replace(/\n/g, " ");
            return { games };
        });

    });



    // console.log(data);

    await browser.close();
    const orderedData = data.map(item => item.games)
    return orderedData;
};

// getGames(); Denna körs i filen där jag exporterar till istället.

export default getGames;
