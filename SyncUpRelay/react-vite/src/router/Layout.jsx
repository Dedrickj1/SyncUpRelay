import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation";
import ServerList from "../components/ServerList/ServerList";
import ChannelList from "../components/ChannelList/ChannelList";
import MessagePane from "../components/MessagePane/MessagePane";
import { useSocket } from "../context/SocketContext";
import "../index.css";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const socket = useSocket();
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    
    if (isLoaded && !user) {
      navigate("/welcome");
    }
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Successfully connected to WebSocket server with ID:', socket.id);
      });
      return () => socket.off('connect');
    }
  }, [socket]);

  
  if (!isLoaded) {
    return null; 
  }

  return (
    <>
      <ModalProvider>
        <Navigation />
        {user && (
          <div className="app-body">
            <div 
              className="sidebar-container"
              onMouseEnter={() => setIsSidebarHovered(true)}
              onMouseLeave={() => setIsSidebarHovered(false)}
            >
              <ServerList onSelectServer={setSelectedServer} />
              <ChannelList 
                server={selectedServer} 
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel} 
                isVisible={isSidebarHovered} 
              />
            </div>
            <MessagePane channel={selectedChannel} />
          </div>
        )}
        <Modal />
      </ModalProvider>
    </>
  );
}