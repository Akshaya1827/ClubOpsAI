require("dotenv").config();

const { analyzeMeeting } = require("./meetingService");

const testMeeting = async () => {
    const transcript = `
    Akshaya: We need to finish the event poster.

    Rahul: I can design the poster.

    Tirtha: Can you finish it by September 25?

    Rahul: Yes, I will finish it by September 25.

    Pritika: We also need to contact the sponsors.

    Akshaya: I'll contact the sponsors tomorrow.

    Tirtha: Good. Let's finalize everything in the next meeting.
    `;

    try {
        const result = await analyzeMeeting(transcript);

        console.log("MEETING ANALYSIS:");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error(error.message);
    }
};

testMeeting();