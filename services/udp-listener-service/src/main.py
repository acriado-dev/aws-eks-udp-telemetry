import socket
import websockets
import asyncio
import time
import os
from dotenv import load_dotenv
from model.f1_2023_specification import PacketHeader, Event, EventDataDetails, CarTelemetryData, \
    PacketCarTelemetryData

load_dotenv()

def get_local_ip():
    try:
        # Create a socket and connect to a remote server
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Google's DNS server
        local_ip = s.getsockname()[0]
        print(f"Local IP: {local_ip}")
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"  # Fallback to localhost if unable to determine IP


UDP_IP = get_local_ip()

UDP_PORT = os.environ.get('UDP_PORT', '5005')
if UDP_PORT is None:
    raise Exception("UDP_PORT environment variable is not set")
else:
    UDP_PORT = int(UDP_PORT)

WEBSOCKET_SERVER = os.environ.get('WEBSOCKET_SERVER')

if WEBSOCKET_SERVER is None:
    raise Exception("WEBSOCKET_SERVER environment variable is not set")

async def send_telemetry():
    sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
    sock.bind((UDP_IP, UDP_PORT))

    async with websockets.connect(WEBSOCKET_SERVER) as websocket:
        while True:
            data, _ = sock.recvfrom(1352) # buffer size is 1024 bytes
            m_header = PacketHeader.from_buffer_copy(data[0:29])
            player_car_index = int(m_header.m_playerCarIndex)
            # print("Header: %s" % m_header)

            if int(m_header.m_packetId) == 6:
                packet = PacketCarTelemetryData.from_buffer_copy(data[0:1352])
                speed = packet.m_carTelemetryData[player_car_index].m_speed
                print(f"Speed: {speed} Km/h")
                await websocket.send(str(speed))

print("F1 telemetry client started...")
while True:
    try:
        print(f"Connecting to {WEBSOCKET_SERVER} ...")
        asyncio.get_event_loop().run_until_complete(send_telemetry())
    except OSError as e:
        print(f"Error: {str(e)}")
        print("Retrying in 5 seconds...")
        time.sleep(5)


