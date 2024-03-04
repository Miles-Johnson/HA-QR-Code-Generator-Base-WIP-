const workflow = `{
  "client_id": "__CLIENT_ID_REPLACE__",
  "prompt": {
      "3": {
          "inputs": {
              "seed": __SEED_REPLACE__,
              "steps": 35,
              "cfg": 6.2,
              "sampler_name": "dpmpp_3m_sde_gpu",
              "scheduler": "karras",
              "denoise": 1,
              "model": ["10", 0],
              "positive": ["6", 0],
              "negative": ["7", 0],
              "latent_image": ["5", 0]
          },
          "class_type": "KSampler"
      },
      "4": {
          "inputs": {
              "ckpt_name": "__CHECKPOINT_REPLACE__"
          },
          "class_type": "CheckpointLoaderSimple"
      },
      "5": {
          "inputs": {
              "width": __WIDTH_REPLACE__,
              "height": __HEIGHT_REPLACE__,
              "batch_size": __BATCH_SIZE_REPLACE__
          },
          "class_type": "EmptyLatentImage"
      },
      "6": {
          "inputs": {
              "text": "__POSITIVE_REPLACE__",
              "clip": ["10", 1]
          },
          "class_type": "CLIPTextEncode"
      },
      "7": {
          "inputs": {
              "text": "__NEGATIVE_REPLACE__",
              "clip": ["10", 1]
          },
          "class_type": "CLIPTextEncode"
      },
      "8": {
          "inputs": {
              "samples": ["3", 0],
              "vae": ["4", 2]
          },
          "class_type": "VAEDecode"
      },
      "9": {
          "inputs": {
              "filename_prefix": "hartsy",
              "images": ["8", 0]
          },
          "class_type": "SaveImage"
      },
      "10": {
          "inputs": {
              "lora_name": "Harrlogos_v2.0.safetensors",
              "strength_model": 0.6900000000000001,
              "strength_clip": 0.6900000000000001,
              "model": ["4", 0],
              "clip": ["4", 1]
          },
          "class_type": "LoraLoader"
      }
  },
  "extra_data": {
      "extra_pnginfo": {
          "workflow": {
              "last_node_id": 16,
              "last_link_id": 20,
              "nodes": [{
                  "id": 8,
                  "type": "VAEDecode",
                  "pos": [1209, 188],
                  "size": {
                      "0": 210,
                      "1": 46
                  },
                  "flags": {},
                  "order": 7,
                  "mode": 0,
                  "inputs": [{
                      "name": "samples",
                      "type": "LATENT",
                      "link": 7
                  }, {
                      "name": "vae",
                      "type": "VAE",
                      "link": 8
                  }],
                  "outputs": [{
                      "name": "IMAGE",
                      "type": "IMAGE",
                      "links": [9],
                      "slot_index": 0
                  }],
                  "properties": {
                      "Node name for S&R": "VAEDecode"
                  }
              }, {
                  "id": 16,
                  "type": "LoraLoader",
                  "pos": [24, 46],
                  "size": {
                      "0": 315,
                      "1": 126
                  },
                  "flags": {},
                  "order": 3,
                  "mode": 4,
                  "inputs": [{
                      "name": "model",
                      "type": "MODEL",
                      "link": 16
                  }, {
                      "name": "clip",
                      "type": "CLIP",
                      "link": 17
                  }],
                  "outputs": [{
                      "name": "MODEL",
                      "type": "MODEL",
                      "links": [20],
                      "slot_index": 0
                  }, {
                      "name": "CLIP",
                      "type": "CLIP",
                      "links": [18, 19],
                      "slot_index": 1
                  }],
                  "properties": {
                      "Node name for S&R": "LoraLoader"
                  },
                  "widgets_values": ["SDXLGhostStyle.safetensors", 1, 1]
              }, {
                  "id": 4,
                  "type": "CheckpointLoaderSimple",
                  "pos": [3, 469],
                  "size": {
                      "0": 315,
                      "1": 98
                  },
                  "flags": {},
                  "order": 0,
                  "mode": 0,
                  "outputs": [{
                      "name": "MODEL",
                      "type": "MODEL",
                      "links": [10],
                      "slot_index": 0
                  }, {
                      "name": "CLIP",
                      "type": "CLIP",
                      "links": [11],
                      "slot_index": 1
                  }, {
                      "name": "VAE",
                      "type": "VAE",
                      "links": [8],
                      "slot_index": 2
                  }],
                  "properties": {
                      "Node name for S&R": "CheckpointLoaderSimple"
                  },
                  "widgets_values": ["__CHECKPOINT_REPLACE__"]
              }, {
                  "id": 7,
                  "type": "CLIPTextEncode",
                  "pos": [413, 389],
                  "size": {
                      "0": 425.27801513671875,
                      "1": 180.6060791015625
                  },
                  "flags": {},
                  "order": 4,
                  "mode": 0,
                  "inputs": [{
                      "name": "clip",
                      "type": "CLIP",
                      "link": 18
                  }],
                  "outputs": [{
                      "name": "CONDITIONING",
                      "type": "CONDITIONING",
                      "links": [6],
                      "slot_index": 0
                  }],
                  "properties": {
                      "Node name for S&R": "CLIPTextEncode"
                  },
                  "widgets_values": ["__NEGATIVE_REPLACE__"]
              }, {
                  "id": 10,
                  "type": "LoraLoader",
                  "pos": [5, 278],
                  "size": {
                      "0": 315,
                      "1": 126
                  },
                  "flags": {},
                  "order": 2,
                  "mode": 0,
                  "inputs": [{
                      "name": "model",
                      "type": "MODEL",
                      "link": 10
                  }, {
                      "name": "clip",
                      "type": "CLIP",
                      "link": 11
                  }],
                  "outputs": [{
                      "name": "MODEL",
                      "type": "MODEL",
                      "links": [16],
                      "slot_index": 0
                  }, {
                      "name": "CLIP",
                      "type": "CLIP",
                      "links": [17],
                      "slot_index": 1
                  }],
                  "properties": {
                      "Node name for S&R": "LoraLoader"
                  },
                  "widgets_values": ["Harrlogos_v2.0.safetensors", 0.6900000000000001, 0.6900000000000001]
              }, {
                  "id": 5,
                  "type": "EmptyLatentImage",
                  "pos": [473, 609],
                  "size": {
                      "0": 315,
                      "1": 106
                  },
                  "flags": {},
                  "order": 1,
                  "mode": 0,
                  "outputs": [{
                      "name": "LATENT",
                      "type": "LATENT",
                      "links": [2],
                      "slot_index": 0
                  }],
                  "properties": {
                      "Node name for S&R": "EmptyLatentImage"
                  },
                  "widgets_values": [__WIDTH_REPLACE__, __HEIGHT_REPLACE__, __BATCH_SIZE_REPLACE__]
              }, {
                  "id": 3,
                  "type": "KSampler",
                  "pos": [863, 184],
                  "size": {
                      "0": 315,
                      "1": 262
                  },
                  "flags": {},
                  "order": 6,
                  "mode": 0,
                  "inputs": [{
                      "name": "model",
                      "type": "MODEL",
                      "link": 20
                  }, {
                      "name": "positive",
                      "type": "CONDITIONING",
                      "link": 4
                  }, {
                      "name": "negative",
                      "type": "CONDITIONING",
                      "link": 6
                  }, {
                      "name": "latent_image",
                      "type": "LATENT",
                      "link": 2
                  }],
                  "outputs": [{
                      "name": "LATENT",
                      "type": "LATENT",
                      "links": [7],
                      "slot_index": 0
                  }],
                  "properties": {
                      "Node name for S&R": "KSampler"
                  },
                  "widgets_values": [__SEED_REPLACE__, "randomize", 35, 6.2, "dpmpp_3m_sde_gpu", "karras", 1]
              }, {
                  "id": 6,
                  "type": "CLIPTextEncode",
                  "pos": [411, 180],
                  "size": {
                      "0": 422.84503173828125,
                      "1": 164.31304931640625
                  },
                  "flags": {},
                  "order": 5,
                  "mode": 0,
                  "inputs": [{
                      "name": "clip",
                      "type": "CLIP",
                      "link": 19
                  }],
                  "outputs": [{
                      "name": "CONDITIONING",
                      "type": "CONDITIONING",
                      "links": [4],
                      "slot_index": 0
                  }],
                  "properties": {
                      "Node name for S&R": "CLIPTextEncode"
                  },
                  "widgets_values": ["__POSITIVE_REPLACE__"]
              }, {
                  "id": 9,
                  "type": "SaveImage",
                  "pos": [1455, 185],
                  "size": {
                      "0": 573.404541015625,
                      "1": 484.4483642578125
                  },
                  "flags": {},
                  "order": 8,
                  "mode": 0,
                  "inputs": [{
                      "name": "images",
                      "type": "IMAGE",
                      "link": 9
                  }],
                  "properties": {},
                  "widgets_values": ["hartsy"]
              }],
              "links": [
                  [2, 5, 0, 3, 3, "LATENT"],
                  [4, 6, 0, 3, 1, "CONDITIONING"],
                  [6, 7, 0, 3, 2, "CONDITIONING"],
                  [7, 3, 0, 8, 0, "LATENT"],
                  [8, 4, 2, 8, 1, "VAE"],
                  [9, 8, 0, 9, 0, "IMAGE"],
                  [10, 4, 0, 10, 0, "MODEL"],
                  [11, 4, 1, 10, 1, "CLIP"],
                  [16, 10, 0, 16, 0, "MODEL"],
                  [17, 10, 1, 16, 1, "CLIP"],
                  [18, 16, 1, 7, 0, "CLIP"],
                  [19, 16, 1, 6, 0, "CLIP"],
                  [20, 16, 0, 3, 0, "MODEL"]
              ],
              "groups": [],
              "config": {},
              "extra": {},
              "version": 0.4
          }
      }
  }
}`;
export default workflow;
