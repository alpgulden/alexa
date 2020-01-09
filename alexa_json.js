{
    "interactionModel": {
        "languageModel": {
            "invocationName": "set my prayer times",
            "intents": [
                {
                    "name": "AMAZON.CancelIntent",
                    "samples": [
                        "cancel"
                    ]
                },
                {
                    "name": "AMAZON.HelpIntent",
                    "samples": [
                        "help"
                    ]
                },
                {
                    "name": "AMAZON.StopIntent",
                    "samples": [
                        "stop"
                    ]
                },
                {
                    "name": "disablePrayerAlarm",
                    "slots": [
                        {
                            "name": "prayerName",
                            "type": "prayers"
                        }
                    ],
                    "samples": [
                        "disable prayer alarm for {prayerName}"
                    ]
                },
                {
                    "name": "AMAZON.NavigateHomeIntent",
                    "samples": []
                },
                {
                    "name": "getPrayer",
                    "slots": [
                        {
                            "name": "time",
                            "type": "AMAZON.TIME"
                        }
                    ],
                    "samples": [
                        "which prayer time {time}",
                        "what prayer time we are at now {time}"
                    ]
                },
                {
                    "name": "setPrayerTimesasAlarm",
                    "slots": [],
                    "samples": [
                        "Set prayer times as alarm"
                    ]
                },
                {
                    "name": "getPrayers",
                    "slots": [],
                    "samples": [
                        "What are the prayer times today"
                    ]
                },
                {
                    "name": "exitSetmyPrayerTimes",
                    "slots": [],
                    "samples": [
                        "exit"
                    ]
                }
            ],
            "types": [
                {
                    "name": "prayers",
                    "values": [
                        {
                            "id": "5",
                            "name": {
                                "value": "Isha"
                            }
                        },
                        {
                            "id": "3",
                            "name": {
                                "value": "Maghrib"
                            }
                        },
                        {
                            "id": "2",
                            "name": {
                                "value": "Asr"
                            }
                        },
                        {
                            "id": "1",
                            "name": {
                                "value": "Zhuhr"
                            }
                        },
                        {
                            "id": "0",
                            "name": {
                                "value": "Fajr"
                            }
                        }
                    ]
                }
            ]
        },
        "dialog": {
            "intents": [
                {
                    "name": "disablePrayerAlarm",
                    "confirmationRequired": false,
                    "prompts": {},
                    "slots": [
                        {
                            "name": "prayerName",
                            "type": "prayers",
                            "confirmationRequired": true,
                            "elicitationRequired": true,
                            "prompts": {
                                "confirmation": "Confirm.Slot.1194709614575.171737920001",
                                "elicitation": "Elicit.Slot.1194709614575.171737920001"
                            }
                        }
                    ]
                },
                {
                    "name": "getPrayer",
                    "confirmationRequired": false,
                    "prompts": {},
                    "slots": [
                        {
                            "name": "time",
                            "type": "AMAZON.TIME",
                            "confirmationRequired": false,
                            "elicitationRequired": true,
                            "prompts": {
                                "elicitation": "Elicit.Slot.553848843724.1103681370610"
                            }
                        }
                    ]
                }
            ],
            "delegationStrategy": "ALWAYS"
        },
        "prompts": [
            {
                "id": "Confirm.Slot.1194709614575.171737920001",
                "variations": [
                    {
                        "type": "PlainText",
                        "value": "you are disabling the alarm set up for prayer"
                    }
                ]
            },
            {
                "id": "Elicit.Slot.1194709614575.171737920001",
                "variations": [
                    {
                        "type": "PlainText",
                        "value": "please specify the prayer name as in Fajr,Zhuhr,Asr,Maghrib or Isha'a"
                    }
                ]
            },
            {
                "id": "Elicit.Slot.553848843724.1103681370610",
                "variations": [
                    {
                        "type": "PlainText",
                        "value": "for what time"
                    }
                ]
            }
        ]
    }
}