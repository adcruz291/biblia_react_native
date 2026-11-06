import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Share, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FormularioConsulta from './src/components/FormularioConsulta';
import ListaVersiculos from './src/components/ListaVersiculos';
import TarjetaVersiculo from './src/components/TarjetaVersiculo';
import { obtenerLibros, obtenerCapitulo, obtenerVersiculo } from './src/api/biblia';
import { limpiarTexto } from './src/utils/texto';

export default function App() {
  const [modo, setModo] = useState('capitulo');
  const [libros, setLibros] = useState([]);
  const [cargandoLibros, setCargandoLibros] = useState(true);
  const [errorLibros, setErrorLibros] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [titulo, setTitulo] = useState('');
  const [versiculos, setVersiculos] = useState([]);
  const [textoVersiculo, setTextoVersiculo] = useState('');
  // Reto "Limpiar": al cambiar este número el formulario se vuelve a montar vacío.
  const [reinicios, setReinicios] = useState(0);

  // Al abrir la app: pedir la lista de libros a la API.
  useEffect(() => {
    async function cargarLibros() {
      try {
        const datos = await obtenerLibros();
        setLibros(datos);
      } catch (e) {
        setErrorLibros('No se pudo cargar la lista de libros. Revisa tu conexión.');
      } finally {
        setCargandoLibros(false);
      }
    }
    cargarLibros();
  }, []);

  const limpiarResultados = () => {
    setError('');
    setTitulo('');
    setVersiculos([]);
    setTextoVersiculo('');
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    limpiarResultados();
  };

  // Reto "Limpiar": borra el formulario y los resultados.
  const limpiarTodo = () => {
    limpiarResultados();
    setReinicios((n) => n + 1);
  };

  const consultar = async ({ libro, capitulo, versiculo }) => {
    limpiarResultados();
    setCargando(true);
    try {
      if (modo === 'versiculo') {
        const dato = await obtenerVersiculo(libro.bookid, capitulo, versiculo);
        if (!dato || !dato.text) {
          throw new Error('Versículo no encontrado');
        }
        setTitulo(`${libro.name} ${capitulo}:${versiculo}`);
        setTextoVersiculo(limpiarTexto(dato.text));
      } else {
        const datos = await obtenerCapitulo(libro.bookid, capitulo);
        if (!Array.isArray(datos) || datos.length === 0) {
          throw new Error('Capítulo no encontrado');
        }
        setTitulo(`${libro.name} ${capitulo}`);
        setVersiculos(datos);
      }
    } catch (e) {
      setError('No se encontró el texto. Verifica el capítulo y el versículo.');
    } finally {
      setCargando(false);
    }
  };

  // Reto "Versículo para hoy": libro al azar y su primer versículo.
  const versiculoParaHoy = async () => {
    const libro = libros[Math.floor(Math.random() * libros.length)];
    limpiarResultados();
    setCargando(true);
    try {
      const dato = await obtenerVersiculo(libro.bookid, 1, 1);
      if (!dato || !dato.text) {
        throw new Error('Versículo no encontrado');
      }
      setTitulo(`Versículo para hoy: ${libro.name} 1:1`);
      setTextoVersiculo(limpiarTexto(dato.text));
    } catch (e) {
      setError('No se pudo obtener el versículo para hoy. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Reto "Compartir": envía el versículo mostrado con el menú del sistema.
  const compartir = () => {
    Share.share({ message: `${titulo}\n${textoVersiculo}` });
  };

  return (
    <View style={estilos.pantalla}>
      <StatusBar style="dark" />
      <Text style={estilos.titulo}>Biblia RV1960</Text>

      <View style={estilos.modos}>
        <View style={estilos.botonModo}>
          <Button
            title="Capítulo completo"
            onPress={() => cambiarModo('capitulo')}
            color={modo === 'capitulo' ? '#08708C' : '#9AA5B1'}
          />
        </View>
        <View style={estilos.botonModo}>
          <Button
            title="Versículo único"
            onPress={() => cambiarModo('versiculo')}
            color={modo === 'versiculo' ? '#08708C' : '#9AA5B1'}
          />
        </View>
      </View>

      {cargandoLibros && <ActivityIndicator size="large" color="#08708C" />}
      {errorLibros !== '' && <Text style={estilos.error}>{errorLibros}</Text>}
      {!cargandoLibros && errorLibros === '' && (
        <>
          <FormularioConsulta
            key={`${modo}-${reinicios}`}
            modo={modo}
            libros={libros}
            cargando={cargando}
            onConsultar={consultar}
          />
          <View style={estilos.modos}>
            <View style={estilos.botonModo}>
              <Button title="Limpiar" onPress={limpiarTodo} color="#9AA5B1" />
            </View>
            <View style={estilos.botonModo}>
              <Button
                title="Versículo para hoy"
                onPress={versiculoParaHoy}
                disabled={cargando}
                color="#B07D1A"
              />
            </View>
          </View>
        </>
      )}

      {cargando && <ActivityIndicator size="large" color="#08708C" />}
      {error !== '' && <Text style={estilos.error}>{error}</Text>}

      {textoVersiculo !== '' && (
        <>
          <TarjetaVersiculo referencia={titulo} texto={textoVersiculo} />
          <Button title="Compartir" onPress={compartir} color="#08708C" />
        </>
      )}
      {versiculos.length > 0 && (
        <ListaVersiculos titulo={titulo} versiculos={versiculos} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F6F4EE',
    paddingTop: 64,
    paddingHorizontal: 20,
    gap: 14,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F1B2D',
  },
  modos: {
    flexDirection: 'row',
    gap: 12,
  },
  botonModo: {
    flex: 1,
  },
  error: {
    fontSize: 16,
    color: '#B3261E',
  },
});
