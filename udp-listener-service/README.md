# f1-telemetry-udp-to-cloud
F1 telemetry ingest to AWS



The packets IDs are as follows:

Packets
Motion 0 Contains all motion data for player’s car – only sent while player is in control
Session 1 Data about the session – track, time left
Lap Data 2 Data about all the lap times of cars in the session
Event 3 Various notable events that happen during a session
Participants 4 List of participants in the session, mostly relevant for multiplayer
Car Setups 5 Packet detailing car setups for cars in the race
Car Telemetry 6 Telemetry data for all cars
Car Status 7 Status data for all cars
Final Classification 8 Final classification confirmation at the end of a race
Lobby Info 9 Information about players in a multiplayer lobby
Car Damage 10 Damage status for all cars
Session History 11 Lap and tyre data for session
Tyre Sets 12 Extended tyre set data
Motion Ex 13 Extended motion data for player car


## Docker

- Build and run locally:
```
docker build -t udp-listener:2 .
docker run -d --name udp-listener-service udp-listener:2
```

- Tag and publish
```
docker tag udp-listener:2 inqidea/real-time-udp-listener:develop.0
docker push inqidea/real-time-udp-listener:develop.0
```

## Docker (ARM/Linux)
- Prepare Build for ARM
```
docker buildx create --use
```

- Buildx
```
docker buildx build --platform=linux/arm64 -t inqidea/real-time-udp-listener:develop.1 .
```
