import type { ArticleContent } from "./types";

/**
 * Article bodies (English). Links use [text](target); targets are resolved in rich-text.tsx:
 * lots, producers, urrao, buyers, samples, regions, story, journal, lot:<code>, article:<id>.
 * Factual claims are kept general and listed for owner review in DECISIONS.md.
 */
export const contentEn: ArticleContent = {
  chiroso: [
    {
      p: [
        "Chiroso is a coffee variety grown around Urrao, a mountain town in western Antioquia, Colombia. Among specialty buyers it has a reputation for a delicate, floral cup, and it is one of the reasons Urrao is known to people who cup coffee for a living. This guide explains what Chiroso is, how it tends to taste and how to buy it.",
      ],
    },
    {
      h2: "Where Chiroso comes from",
      p: [
        "Chiroso is closely tied to Urrao and to the slopes around the Páramo del Sol. Local families have grown it for years next to more common Colombian varieties such as Castillo and Caturra. You will find it on the farms of our [producers in Urrao](producers), and it is one of the three varieties we list for the region.",
        "Its exact genetic history is still discussed, and we would rather say less than say something we cannot confirm. What we can say is that it is not widely planted outside this part of Antioquia, which is why a Chiroso lot always comes with a place name and a farm. Our team is checking the details with producers before this page is final.",
      ],
    },
    {
      h2: "What Chiroso tastes like",
      p: [
        "Growers and cuppers usually describe Chiroso as clean and floral, with a tea-like body and a soft, sweet fruitiness. Think jasmine and white peach rather than heavy chocolate. In this preview, the example lot [URR-024](lot:urr-024), from Finca El Mirador, lists jasmine, white peach and panela, with an SCA score of 87.5. These are example data for the design preview, not a real offer.",
        "No variety guarantees a flavor. Altitude, harvest timing, fermentation and drying all change the cup, so the best way to know a Chiroso is to taste it. That is why we recommend a sample before any order.",
      ],
    },
    {
      h2: "Why altitude and climate matter",
      p: [
        "Farms in Urrao grow coffee between roughly 1,800 and 2,300 meters above sea level. At that height the nights are cool and the cherries ripen slowly. In general, slow ripening gives the bean more time to build sugars and structure, which is one reason high-altitude coffees are often prized for their clarity and acidity.",
        "Altitude is not a quality score by itself. A careful harvest of ripe cherries and clean processing matter just as much, and every lot page shows the altitude next to the process so you can compare. For the full picture of the place, read our [guide to Urrao](article:urrao).",
      ],
    },
    {
      h2: "How Chiroso is processed",
      p: [
        "Chiroso can be washed, honey or natural. Washed lots tend to show the variety's clarity and floral side. Natural and honey lots usually bring more fruit and sweetness, with a heavier body. Each lot lists its process in the title, so you can filter and compare without opening every page.",
        "If you are new to the variety, a washed lot is a good first sample, because it lets the variety speak with the fewest layers on top.",
      ],
    },
    {
      h2: "Roasting and brewing notes",
      p: [
        "Roasters who work with delicate, floral coffees usually keep the roast on the lighter side and watch the development time, so that jasmine and stone fruit notes are not baked out. Start from the profile you use for other high-grown washed coffees and adjust after each cupping.",
        "At home, a filter method such as a pour-over tends to show the clarity of the variety. Use fresh water, a medium grind and a slightly cooler brew than you would for a darker roast. These are general tips, and your own roaster and palate are the final judge.",
      ],
    },
    {
            h2: "How to buy Chiroso green coffee",
      p: [
        "Browse the [green coffee lots](lots) and filter by variety. Each lot shows the producer, farm, altitude, process, cup profile and a price in US dollars per kilogram, FOB. Prices and availability in this preview are examples until real offers are published.",
        "Then [request a sample](samples) of the lot that fits your roasting profile. The usual minimum order is one 35 kg box. If you are importing for the first time, our article on [how to buy green coffee from Colombia](article:buying) walks through the steps, and the [for buyers](buyers) page covers pricing, trust levels and logistics.",
        "Prefer to start with the people? Meet the [producers](producers) behind the lots and read how each farm works.",
      ],
    },
  ],
  buying: [
    {
      p: [
        "Buying green coffee from Colombia is simpler than it looks once you know the order of the steps. You decide what you need, check who grew it, taste it, agree a price and plan the shipment. This guide walks through each step and points to the pages on our site where you can act on it.",
      ],
    },
    {
      h2: "Start with what you need",
      p: [
        "Before you look at lots, write down four things: the flavor profile you roast for, the process you prefer (washed, honey or natural), the volume you need per year and when you need it. A café that buys two boxes a month has different needs from an importer filling a container.",
        "With that list, open the [green coffee lots](lots) and filter by variety, process and score. If nothing fits, tell us what you are looking for and we will ask our producers.",
      ],
    },
    {
      h2: "Check who grew it",
      p: [
        "Every lot on our platform shows the producer, farm and town. We also mark each lot with one of three trust levels. Registered means the details come from the producer. Farm verified means our team reviewed the farm. Coffee verified means the lot was cupped and documented. Use the level to decide how much more you want to check before you order.",
        "You can read the story of each farm on the [producers](producers) page, and the [guide to Urrao](article:urrao) explains the region they share.",
      ],
    },
    {
      h2: "Ask for a sample first",
      p: [
        "Never buy a lot you have not tasted. [Request a sample](samples) of the lot you like, roast it your way and cup it next to your current coffee. Our sample policy is a small amount of coffee for verified buyers, and the exact size and conditions are confirmed when you ask. In this preview the example is 200 g.",
        "A sample also tests the working relationship. Notice how quickly and clearly the producer team answers your questions.",
      ],
    },
    {
      h2: "Understand FOB pricing",
      p: [
        "Prices on our lots are in US dollars per kilogram, FOB. FOB stands for free on board: the price covers the coffee until it is loaded onto the vessel or aircraft at the port of origin. From there you pay for international freight, insurance, import duties and delivery to your roastery. Ask for a quote that spells out each of these so you can compare it with other origins.",
        "Some lots show price on request, usually because the lot is small or still being cupped. Ask us and we will answer with a figure for your volume.",
      ],
    },
    {
      h2: "Plan the lot size and the shipment",
      p: [
        "Our lots are packed in 35 kg boxes or bags, and the minimum order is one of them. The example lot URR-024 is packed in GrainPro inside jute to protect the coffee from humidity on the way. Smaller buyers can combine boxes from the same lot, and larger buyers can ask for several lots at once.",
        "Export paperwork, shipping terms, payment terms and lead times are confirmed in each quote, because they depend on your country and your volume. We help coordinate the export so that you are not managing it alone. The [for buyers](buyers) page lists the usual steps and the questions buyers ask most.",
      ],
    },
    {
      h2: "Mistakes to avoid",
      p: [
        "A few habits save buyers a lot of trouble. Do not compare prices without comparing what they include: an FOB price and a delivered price are different numbers. Do not skip the harvest year, because green coffee loses vibrancy as it ages. Do not order without asking how the coffee is packed and what its moisture level is, since both affect how it keeps.",
        "Finally, do not buy only on a score. A cupping score is a useful signal, but it describes one table on one day. Taste the coffee, read the producer's story and make sure the flavor fits your customers.",
      ],
    },
    {
            h2: "Start the conversation",
      p: [
        "The shortest path is to pick one lot, request a sample and tell us your volume. If you want to see where the coffee comes from first, read about [Chiroso coffee](article:chiroso) or visit the [regions](regions) page.",
      ],
    },
  ],
  urrao: [
    {
      p: [
        "Urrao is a mountain town in the southwest of Antioquia, Colombia, and the first origin on Colombian Coffee Origins. It is a region of family farms, cool nights and high slopes, and it is home to the Chiroso variety. This guide covers where Urrao is, what makes its coffee distinctive, when it is harvested and how you can buy it.",
      ],
    },
    {
      h2: "Where Urrao is",
      p: [
        "Urrao sits in the Andes of western Antioquia, in a valley surrounded by high ridges. Coffee farms climb the slopes toward the Páramo del Sol, a high-altitude landscape at the edge of the farmland. Our [Urrao region page](urrao) has the facts at a glance and a map placeholder that will be replaced with a real map.",
        "The valley is a working landscape: small plots of coffee sit beside pasture and forest, and most farms are reached by narrow mountain roads. That closeness between farm and town is part of why we can visit the producers we list.",
      ],
    },
    {
      h2: "Altitude and climate",
      p: [
        "Farms around Urrao grow coffee at roughly 1,800 to 2,300 meters above sea level. At this altitude days are mild and nights are cool, and cherries ripen more slowly than they do on lower farms. In general, a slower ripening gives the bean more time to develop sugars and structure, which is why high-grown coffees often taste clean and sweet, with lively acidity.",
        "The example lots in this preview range from about 1,950 to 2,250 meters, and each lot page shows the altitude of its farm.",
      ],
    },
    {
      h2: "The varieties of Urrao",
      p: [
        "Three varieties define our Urrao offer. Chiroso is the local specialty, valued for its floral and tea-like cup. Castillo was developed in Colombia for resistance to leaf rust and is widely grown across the country. Caturra is a compact, productive plant that has been planted in Colombia for decades. You can read more in our article on [Chiroso coffee](article:chiroso).",
        "Some farms also grow other varieties in small plots, such as Geisha and Pink Bourbon, which appear in the example lots of this preview.",
      ],
    },
    {
      h2: "Harvest and calendar",
      p: [
        "Colombia's mild climate near the equator means that many regions harvest more than once a year, usually a larger main crop and a smaller second crop. The exact months in Urrao depend on altitude and rain, so the calendar on our region page is an example that we will confirm with each producer before launch.",
        "Every lot page states its harvest year, so you always know how fresh the green coffee is.",
      ],
    },
    {
      h2: "Family farms and their coffee",
      p: [
        "Coffee in Urrao is mostly grown by families on small farms. We list the farms by name, with their producer and town, because we believe the person who grew the coffee should be visible. You can read about [Luz Mery Higuita and the other producers](producers) in our directory, and see their [lots from Urrao](lots) with cup profile and price.",
        "The producer stories on the site are placeholders until we write them together with each family.",
      ],
    },
    {
      h2: "What to look for in a lot from Urrao",
      p: [
        "When you open a lot page, read four things first: the altitude, the variety, the process and the harvest year. Together they tell you most of what to expect in the cup. A washed Chiroso from a farm above 2,000 meters will usually taste different from a natural Caturra grown lower down.",
        "Then look at the trust level and the producer's page. If a lot has not been cupped yet, it says so, and a sample is the quickest way to find out what it offers.",
      ],
    },
    {
            h2: "How to buy coffee from Urrao",
      p: [
        "If you roast or import coffee, start with a sample. [Request a sample](samples), cup it, and then talk to us about volume. Our [for buyers](buyers) page explains pricing in US dollars per kilogram, the trust levels and the shipping steps. If you are new to importing, read [how to buy green coffee from Colombia](article:buying).",
        "If you live in Colombia, you can also buy roasted bags made by the producers in our shop.",
      ],
    },
  ],
};
