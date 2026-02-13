# 3D Models Directory

Place your 3D model files here.

## Supported Formats
- `.glb` (recommended - binary glTF)
- `.gltf` (JSON glTF)
- `.obj` (Wavefront OBJ)
- `.fbx` (Autodesk FBX)

## Example Files
- `automytee-model.glb` - Main 3D model for Hero3D component
- `product-showcase.glb` - Product visualization
- `animation-demo.glb` - Animated model

## File Size Recommendations
- Simple models: < 1MB
- Detailed models: < 5MB
- Complex/animated: < 10MB

## How to Add Your Model
1. Export from Blender/Maya/3DS Max as GLB
2. Place file in this directory
3. Update `Hero3D.tsx` to load your model
4. See `/.agent/ADD_CUSTOM_3D_MODEL.md` for detailed instructions

## Optimization Tools
- **glTF Transform**: https://gltf-transform.donmccurdy.com/
- **Draco Compression**: Reduces file size by 90%
- **Texture Compression**: Use JPG for colors, PNG for transparency
