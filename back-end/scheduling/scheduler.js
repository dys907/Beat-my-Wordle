const scheduler = require("node-schedule");
const timezones = require('./configs/timezones');

const deleteLobbies = require("./matchDeleteAll");
const deleteWords = require("./wordDeleteAll");

let rule = new scheduler.RecurrenceRule();

rule.tz = timezones.PST;
//start time
rule.hour = 0;
rule.minute = 0;

const schedule = scheduler.scheduleJob(rule, async ()=> {
    try {
        await (deleteLobbies());
        await (deleteWords());
    } catch (error) {
        console.log(error);
    }
})

module.exports = schedule;