import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Memory } from '@/types/memory';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';

interface MapViewProps {
  memories: Memory[];
  onMemoryClick?: (memory: Memory) => void;
}

export const MapView: React.FC<MapViewProps> = ({ memories, onMemoryClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('mapbox_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for memories with location data
      memories.forEach((memory) => {
        const photo = memory.photos[0];
        if (photo?.metadata?.latitude && photo?.metadata?.longitude) {
          const el = document.createElement('div');
          el.className = 'memory-marker';
          el.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
          `;
          
          const icon = document.createElement('div');
          icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="hsl(var(--primary))"/></svg>';
          el.appendChild(icon);

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)';
          });
          
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
          });

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: hsl(var(--foreground));">${memory.title}</h3>
              <p style="margin: 0; font-size: 14px; color: hsl(var(--muted-foreground));">${new Date(memory.date).toLocaleDateString()}</p>
            </div>
          `);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([photo.metadata.longitude, photo.metadata.latitude])
            .setPopup(popup)
            .addTo(map.current!);

          el.addEventListener('click', () => {
            if (onMemoryClick) {
              onMemoryClick(memory);
            }
          });
        }
      });

      setError('');
    } catch (err) {
      setError('Invalid Mapbox API key. Please check your key and try again.');
      console.error('Mapbox error:', err);
    }

    return () => {
      map.current?.remove();
    };
  }, [apiKey, memories, onMemoryClick]);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('mapbox_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setTempKey('');
    }
  };

  if (!apiKey) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Memory Map Setup</h2>
          </div>
          
          <p className="text-muted-foreground">
            To view your memories on an interactive map, you'll need a Mapbox API token.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="mapbox-key">Mapbox Public Token</Label>
            <Input
              id="mapbox-key"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Get your free token at{' '}
              <a
                href="https://account.mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          <Button onClick={handleSaveKey} disabled={!tempKey.trim()}>
            Save Token & Load Map
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
