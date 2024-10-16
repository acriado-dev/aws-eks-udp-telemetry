import ctypes

class PacketHeader(ctypes.LittleEndianStructure):
    _pack_ = 1
    _fields_ = [
        ("m_packetFormat", ctypes.c_uint16), # 2023
        ("m_gameYear", ctypes.c_uint8),
        ("m_gameMajorVersion", ctypes.c_uint8),
        ("m_gameMinorVersion", ctypes.c_uint8),
        ("m_packetVersion", ctypes.c_uint8),
        ("m_packetId", ctypes.c_uint8),
        ("m_sessionUID", ctypes.c_uint64),
        ("m_sessionTime", ctypes.c_float),
        ("m_frameIdentifier", ctypes.c_uint32), # Identifier for the frame the data was retrieved on
        ("m_overallFrameIdentifier", ctypes.c_uint32), #Overall identifier for the frame the data was retrieved
        ("m_playerCarIndex", ctypes.c_uint8), # Index of player's car in the array
        ("m_secondaryPlayerCarIndex", ctypes.c_uint8), # Index of secondary player's car in the array. 255 if no second player
    ]

    def __str__(self):
        return f"PacketHeader(packetFormat={self.m_packetFormat}, gameYear={self.m_gameYear}, gameMajorVersion={self.m_gameMajorVersion}, gameMinorVersion={self.m_gameMinorVersion}, packetVersion={self.m_packetVersion}, packetId={self.m_packetId}, sessionUID={self.m_sessionUID}, sessionTime={self.m_sessionTime}, frameIdentifier={self.m_frameIdentifier}, overallFrameIdentifier={self.m_overallFrameIdentifier}, playerCarIndex={self.m_playerCarIndex}, secondaryPlayerCarIndex={self.m_secondaryPlayerCarIndex})"

    def __repr__(self):
        return str(self)


class EventDataDetails(ctypes.LittleEndianStructure):
    """
    This packet gives details of events that happen during the course of a session.

    Frequency: When the event occurs
    """
    _pack_ = 1
    _fields_ = [

    ]

    class ButtonEvent(ctypes.LittleEndianStructure):
        _pack_ = 1
        _fields_ = [
            ('m_buttonStatus', ctypes.c_uint32),  # Bit flag specifying which buttons are being pressed
        ]

        def __str__(self):
            return f"ButtonEvent(buttonStatus={self.m_buttonStatus})"

"""
This packet gives details of events that happen during the course of a session.

Frequency: When the event occurs
Size: 45 bytes
Version: 1

The event details packet is different for each type of event.
Make sure only the correct type is interpreted.
"""
class Event(ctypes.LittleEndianStructure):
    _pack_ = 1
    _fields_ = [
        ('m_header', PacketHeader),                         # Header
        ("m_eventStringCode", ctypes.c_char * 4),
        ('m_eventDetails', EventDataDetails),       # Event details - should be interpreted differently for each type
    ]

    def __str__(self):
        return f"Event(header={self.m_header}, eventStringCode={self.m_eventStringCode}, eventDetails={self.m_eventDetails})"


"""
Car Telemetry Packet

This packet details telemetry for all the cars in the race. It details various values that would be recorded on 
the car such as speed, throttle application, DRS etc. Note that the rev light configurations are presented separately 
as well and will mimic real life driver preferences.

Frequency: Rate as specified in menus
Size: 1352 bytes
Version: 1
"""
class CarTelemetryData(ctypes.LittleEndianStructure):
    _pack_ = 1
    _fields_ = [
        ('m_speed', ctypes.c_uint16),  # Speed of car in kilometers per hour
        ('m_throttle', ctypes.c_float),  # Amount of throttle applied (0.0 to 1.0)
        ('m_steer', ctypes.c_float),  # Steering (-1.0 (full lock left) to 1.0 (full lock right))
        ('m_brake', ctypes.c_float),  # Amount of brakes applied (0 to 100)
        ('m_clutch', ctypes.c_uint8),  # Amount of clutch applied (0 to 100)
        ('m_gear', ctypes.c_int8),  # Gear selected (-1 for reverse, 0 for neutral, 1-8 for drive)
        ('m_engineRPM', ctypes.c_uint16),  # Engine RPM
        ('m_drs', ctypes.c_uint8),  # 0 = off, 1 = on
        ('m_revLightsPercent', ctypes.c_uint8),  # Rev lights indicator (percentage)
        ('m_revLightsBitValue', ctypes.c_uint16),  # Rev lights (bit 0 = leftmost LED, bit 14 = rightmost LED)
        ('m_brakesTemperature', ctypes.c_uint16 * 4),  # Brakes temperature (celsius)
        ('m_tyresSurfaceTemperature', ctypes.c_uint8 * 4),  # Tyres surface temperature (celsius)
        ('m_tyresInnerTemperature', ctypes.c_uint8 * 4),  # Tyres inner temperature (celsius)
        ('m_engineTemperature', ctypes.c_uint16),  # Engine temperature (celsius)
        ('m_tyresPressure', ctypes.c_float * 4),  # Tyres pressure (PSI)
        ('m_surfaceType', ctypes.c_uint8 * 4),  # Rev lights indicator (percentage)
    ]

    def __str__(self):
        return f"CarTelemetryData(speed={self.m_speed}, throttle={self.m_throttle}, steer={self.m_steer}, brake={self.m_brake}, clutch={self.m_clutch}, gear={self.m_gear}, engineRPM={self.m_engineRPM}, drs={self.m_drs}, revLightsPercent={self.m_revLightsPercent}, revLightsBitValue={self.m_revLightsBitValue}, brakesTemperature={self.m_brakesTemperature}, tyresSurfaceTemperature={self.m_tyresSurfaceTemperature}, tyresInnerTemperature={self.m_tyresInnerTemperature}, engineTemperature={self.m_engineTemperature}, tyresPressure={self.m_tyresPressure}, surfaceType={self.m_surfaceType})"

class PacketCarTelemetryData(ctypes.LittleEndianStructure):
    _pack_ = 1
    _fields_ = [
        ('m_header', PacketHeader),  # Header
        ('m_carTelemetryData', CarTelemetryData * 22),
        ('m_mfdPanelIndex', ctypes.c_uint8), #Index of MFD panel open - 255 = MFD closed. Single player, race – 0 = Car setup, 1 = Pits 2 = Damage, 3 =  Engine, 4 = Temperatures
        ('m_mfdPanelIndexSecondaryPlayer', ctypes.c_uint8),
        ('m_suggestedGear', ctypes.c_int8), # Suggested gear for the player (1-8). 0 if no gear suggested
    ]

    def __str__(self):
        return f"PacketCarTelemetryData(header={self.m_header}, carTelemetryData={self.m_carTelemetryData}, mfdPanelIndex={self.m_mfdPanelIndex}, mfdPanelIndexSecondaryPlayer={self.m_mfdPanelIndexSecondaryPlayer}, suggestedGear={self.m_suggestedGear})"

